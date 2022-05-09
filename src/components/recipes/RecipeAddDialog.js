import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

export default function RecipeAddDialog(props) {
  const { open, setAddDialogOpen, handleSubmit } = props

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
      <Box component='form' onSubmit={onSubmit} noValidate>
        <DialogTitle>Add recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter a name:</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            name='name'
            label='name'
            fullWidth
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type='submit' variant='primary'>
            Add
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
