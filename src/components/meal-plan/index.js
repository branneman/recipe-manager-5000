import { DateTime } from 'luxon'
import { values } from 'ramda'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import ConfirmDialog from '../../components/confirm-dialog'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import DeleteIcon from '@mui/icons-material/Delete'

export default function MealPlan(props) {
  const { mealplan, onCardClick, removeMealplan } = props

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)

  return (
    <>
      {/* ConfirmDialog must be outside of Card to prevent onCardClick */}
      <ConfirmDialog
        isOpen={confirmDeleteDialogOpen}
        setOpen={setConfirmDeleteDialogOpen}
        onConfirm={removeMealplan(mealplan.id)}
        title="Delete meal plan?"
        text={`The following meal plan will be deleted: ${mealplan.name}`}
        confirmText="Delete"
      />

      <Card
        sx={{ minWidth: 275, cursor: 'pointer' }}
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
        </CardContent>
      </Card>
    </>
  )
}
