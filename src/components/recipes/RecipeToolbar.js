import AddDialog from '../add-dialog'

import { alpha } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import MealPlanIcon from '@mui/icons-material/CalendarMonth'

export default function RecipeToolbar(props) {
  const {
    numSelected,
    addDialogOpen,
    setAddDialogOpen,
    handleAddDialogSubmit,
    handleDelete,
    handleAddToMealPlan,
  } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {/* Mode: Default */}
      {numSelected === 0 && (
        <>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant='h6'
            id='tableTitle'
            component='div'
          >
            Recipes
          </Typography>

          <AddDialog
            title='Add recipe'
            open={addDialogOpen}
            setAddDialogOpen={setAddDialogOpen}
            handleSubmit={handleAddDialogSubmit}
          />
          <Tooltip title='Add recipe'>
            <IconButton onClick={() => setAddDialogOpen(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Filter'>
            <span>
              <IconButton disabled>
                <FilterListIcon />
              </IconButton>
            </span>
          </Tooltip>
        </>
      )}

      {/* Mode: Selecting */}
      {numSelected > 0 && (
        <>
          <Typography
            sx={{ flex: '1 1 100%' }}
            color='inherit'
            variant='subtitle1'
            component='div'
          >
            {numSelected} selected
          </Typography>

          <Tooltip title='Add to meal plan'>
            <IconButton onClick={handleAddToMealPlan} disabled>
              <MealPlanIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  )
}
