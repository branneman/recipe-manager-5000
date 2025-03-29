import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

export default function AddDialog(props) {
  const { title, open, setAddDialogOpen, handleSubmit } = props

  const onSubmit = (event) => {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const name = form.get('name')
    if (!name) return onCancel()

    setAddDialogOpen(false)
    handleSubmit(name)
  }

  const onCancel = () => {
    setAddDialogOpen(false)
  }

  return (
    <Dialog open={open} onClose={onCancel}>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            id="name"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
