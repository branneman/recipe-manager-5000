import { useState, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { db } from '../../util/firebase'
import { ref, set, remove } from 'firebase/database'
import { useListVals } from 'react-firebase-hooks/database'
import { activeSortedShoppingList } from '../../util/sorting'
import { callIfEnterKeyWasPressed } from '../../util/dom'
import { find, propEq } from 'ramda'
import { DateTime } from 'luxon'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AddToListIcon from '@mui/icons-material/PlaylistAdd'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import RemoveFromListIcon from '@mui/icons-material/PlaylistRemove'

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
      await set(ref(db, 'shopping-list/' + id), {
        id,
        text: '',
        created: now,
        lastUpdated: now,
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
      await set(ref(db, 'shopping-list/' + id), {
        id,
        text,
        created: find(propEq('id', id), list).created,
        lastUpdated: DateTime.now().toUTC().toISO(),
      })
    } catch (err) {
      // todo: report error
    }
  }

  const deleteItem = (id) => async (_event) => {
    try {
      await remove(ref(db, 'shopping-list/' + id))
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
                <ListItem key={item.id} sx={{ p: 0, mb: 1 }}>
                  <Tooltip title='Drag to re-order'>
                    <DragIndicatorIcon
                      fontSize='small'
                      sx={{ cursor: 'grab' }}
                    />
                  </Tooltip>

                  {editingItem === item.id ? (
                    <TextField
                      inputRef={editingItemRef}
                      name={`item-${item.id}`}
                      defaultValue={item.text}
                      onBlur={saveItem(item.id)}
                      onKeyPress={(evt) =>
                        callIfEnterKeyWasPressed(evt, () => evt.target.blur())
                      }
                      variant='standard'
                      fullWidth
                    />
                  ) : (
                    <Typography
                      onClick={() => setEditingItem(item.id)}
                      sx={{
                        cursor: 'text',
                        flexGrow: 1,
                        minHeight: '34px',
                        p: '4px 0 5px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          paddingBottom: '4px',
                          borderBottom: '2px solid #fff',
                        },
                      }}
                    >
                      {item.text}{' '}
                    </Typography>
                  )}

                  <Tooltip title='Remove item'>
                    <IconButton
                      onClick={deleteItem(item.id)}
                      sx={{ ml: -1, alignSelf: 'start' }}
                    >
                      <RemoveFromListIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}

            <ListItem sx={{ p: 0 }}>
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
