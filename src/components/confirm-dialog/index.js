import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function ConfirmDialog(props) {
  const { isOpen, setOpen, onConfirm, title, text, confirmText } = props

  const onClose = () => {
    setOpen(false)
  }
  const onConfirmClick = () => {
    setOpen(false)
    onConfirm()
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirmClick} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
