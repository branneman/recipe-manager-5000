import { useState, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { db } from '../../util/firebase'
import { ref, set, update, remove } from 'firebase/database'
import { useListVals } from 'react-firebase-hooks/database'
import { activeSortedShoppingList } from '../../util/sorting'
import {
  map,
  find,
  propEq,
  slice,
  insert,
  concat,
  addIndex,
  assoc,
  filter,
  toPairs,
  complement,
} from 'ramda'
import { DateTime } from 'luxon'

import ShoppingListItem from '../../components/shopping-list/item'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AddToListIcon from '@mui/icons-material/PlaylistAdd'

export default function ShoppingList() {
  const [rawList, loading, error] = useListVals(ref(db, 'shopping-list'))
  const list = activeSortedShoppingList(rawList)

  const [editingItem, setEditingItem] = useState(null)
  const editingItemRef = useRef(null)
  useEffect(() => {
    if (editingItem && editingItemRef && editingItemRef.current)
      editingItemRef.current.focus()
  }, [editingItem])

  const addItem = async () => {
    const id = uuid()
    const now = DateTime.now().toUTC().toISO()
    try {
      // Reset all orders
      const ops = {}
      for (const [i, item] of toPairs(list)) {
        ops[`shopping-list/${item.id}/order`] = Number(i) + 1
      }
      await update(ref(db), ops)

      // Save new item
      await set(ref(db, 'shopping-list/' + id), {
        id,
        text: '',
        created: now,
        lastUpdated: now,
        order: list.length + 1,
      })
    } catch (err) {
      // todo: report error
    }
    setEditingItem(id)
  }

  const saveItem = (id) => async (event) => {
    setEditingItem(null)
    const text = event.target.value
    try {
      const ops = {}
      ops[`shopping-list/${id}/id`] = id
      ops[`shopping-list/${id}/text`] = text
      ops[`shopping-list/${id}/lastUpdated`] = DateTime.now().toUTC().toISO()
      await update(ref(db), ops)
    } catch (err) {
      // todo: report error
    }
  }

  const moveItem = async (id, fromOrder, toOrder) => {
    try {
      const newList = updateOrder(fromOrder, toOrder, list)
      const ops = {}
      for (const item of newList) {
        ops[`shopping-list/${item.id}/order`] = item.order
      }
      await update(ref(db), ops)
    } catch (err) {
      // todo: report error
    }
  }

  const deleteItem = (id) => async (_event) => {
    try {
      // Remove item
      await remove(ref(db, 'shopping-list/' + id))

      // Reset all orders
      const listWithoutRemovedItem = filter(complement(propEq('id', id)), list)
      const ops = {}
      for (const [i, item] of toPairs(listWithoutRemovedItem)) {
        ops[`shopping-list/${item.id}/order`] = Number(i) + 1
      }
      await update(ref(db), ops)
    } catch (err) {
      // todo: report error
    }
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {error && (
        <Box sx={{ marginTop: 1 }}>
          <Alert severity='error'>
            <AlertTitle>Error:</AlertTitle>
            <pre>
              <code>{error.message}</code>
            </pre>
          </Alert>
        </Box>
      )}

      {!error && loading && <Skeleton height={300} />}

      {!error && !loading && list && (
        <Box sx={{ p: 2 }}>
          <Typography variant='h6' sx={{ mt: 0.5, mb: 1 }}>
            Shopping list
          </Typography>

          <List>
            {Array.isArray(list) &&
              list.map((item) => (
                <ShoppingListItem
                  key={item.id}
                  item={item}
                  editingItemRef={editingItemRef}
                  editingItem={editingItem}
                  setEditingItem={setEditingItem}
                  saveItem={saveItem}
                  moveItem={moveItem}
                  deleteItem={deleteItem}
                ></ShoppingListItem>
              ))}

            <ListItem key='new-item' sx={{ p: 0 }}>
              <Tooltip title='Add item'>
                <IconButton
                  onClick={addItem}
                  sx={{ ml: -1, alignSelf: 'start' }}
                >
                  <AddToListIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </ListItem>
          </List>
        </Box>
      )}
    </Paper>
  )
}

export const updateOrder = (fromOrder, toOrder, xs) => {
  const start = slice(0, fromOrder - 1, xs)
  const item = find(propEq('order', fromOrder), xs)
  const end = slice(fromOrder, Infinity, xs)

  const resetOrderProp = addIndex(map)((x, i) => assoc('order', i + 1, x))

  const ys = insert(toOrder - 1, item, concat(start, end))
  return resetOrderProp(ys)
}
