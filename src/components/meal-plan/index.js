import { DateTime } from 'luxon'
import { values } from 'ramda'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { currentMealplanDay, isCurrentMealPlan } from '../../util/sorting'
import { capitalise } from '../../util/string'

import ConfirmDialog from '../../components/confirm-dialog'
import RecipeMeal from '../../components/recipes/RecipeMeal'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import DeleteIcon from '@mui/icons-material/Delete'

export default function MealPlan(props) {
  const { mealplan, onCardClick, deleteMealplan } = props

  const now = DateTime.now()

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)

  let currentDay = null
  if (mealplan.days && isCurrentMealPlan(mealplan, now)) {
    currentDay = currentMealplanDay(mealplan, now)
  }

  return (
    <>
      {/* ConfirmDialog must be outside of Card to prevent onCardClick */}
      <ConfirmDialog
        isOpen={confirmDeleteDialogOpen}
        setOpen={setConfirmDeleteDialogOpen}
        onConfirm={deleteMealplan(mealplan.id)}
        title="Delete meal plan?"
        text={`The following meal plan will be deleted: ${mealplan.name}`}
        confirmText="Delete"
      />

      <Card
        sx={{ mb: 2, cursor: 'pointer' }}
        onClick={onCardClick(mealplan.id)}
      >
        <CardContent sx={{ pb: 0 }}>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={10}>
              <Typography
                component={RouterLink}
                to={`/meal-plans/${mealplan.id}`}
                variant="h5"
                color="text.primary"
                style={{ textDecoration: 'none' }}
              >
                {mealplan.name}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'right' }}>
              <Tooltip title={`Delete ${mealplan.name}`}>
                <IconButton
                  className="is-delete-button"
                  onClick={() => setConfirmDeleteDialogOpen(true)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {mealplan.days && values(mealplan.days).length && (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              {values(mealplan.days).length} day
              {values(mealplan.days).length > 1 ? 's' : ''}, starts at{' '}
              {DateTime.fromISO(mealplan.start).toLocaleString(
                DateTime.DATE_HUGE,
                { locale: 'gb' }
              )}
            </Typography>
          )}

          {!mealplan.days && (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              No days added yet
            </Typography>
          )}

          {currentDay && (
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: '18px' }}
              >
                Day {currentDay.day + 1}:{' '}
                {DateTime.fromISO(mealplan.start)
                  .plus({ days: currentDay.day })
                  .toFormat('ccc dd LLL')}
              </Typography>
              <Table size="small">
                <TableBody>
                  {['breakfast', 'lunch', 'dinner'].map(
                    (meal) =>
                      currentDay[meal] && (
                        <TableRow key={meal}>
                          <TableCell
                            sx={{
                              p: 0.75,
                              pl: 0,
                              width: 70,
                              verticalAlign: 'top',
                            }}
                          >
                            {capitalise(meal)}:
                          </TableCell>
                          <TableCell
                            sx={{ p: 0.75, pr: 0, whiteSpace: 'pre-line' }}
                          >
                            <RecipeMeal text={currentDay[meal]} />
                          </TableCell>
                        </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  )
}
