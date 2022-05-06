import { alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import MealPlanIcon from '@mui/icons-material/CalendarMonth'

export default function TableToolbar(props) {
  const { numSelected } = props

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
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Recipes
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title='Add to meal plan'>
            <IconButton>
              <MealPlanIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip title='Add recipe'>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Filter'>
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  )
}