import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { callIfEnterKeyWasPressed } from '../../util/dom'

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import RemoveFromListIcon from '@mui/icons-material/PlaylistRemove'

export default function ShoppingListItem(props) {
  const {
    item,
    editingItemRef,
    editingItem,
    setEditingItem,
    saveItem,
    moveItem,
    deleteItem,
  } = props

  const dropRef = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'shopping-list-item',
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(dragItem, monitor) {
      if (!dropRef.current) return
      const dragIndex = dragItem.index
      const hoverIndex = item.order
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = dropRef.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveItem(item.id, dragIndex, hoverIndex)
      dragItem.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'shopping-list-item',
    item: () => ({ id: item.id, index: item.order }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })

  drop(dropRef)

  return (
    <ListItem
      ref={dropRef}
      data-handler-id={handlerId}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      sx={{ p: 0, mb: 1 }}
    >
      <div ref={drag}>
        <DragIndicatorIcon fontSize="small" sx={{ cursor: 'grab' }} />
      </div>

      {editingItem === item.id ? (
        <TextField
          inputRef={editingItemRef}
          name={`item-${item.id}`}
          defaultValue={item.text}
          onBlur={saveItem(item.id)}
          onKeyPress={(evt) =>
            callIfEnterKeyWasPressed(evt, () => evt.target.blur())
          }
          variant="standard"
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

      <Tooltip title="Remove item">
        <IconButton
          onClick={deleteItem(item.id)}
          sx={{ ml: -1, alignSelf: 'start' }}
        >
          <RemoveFromListIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItem>
  )
}
