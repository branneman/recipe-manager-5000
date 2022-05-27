import { ref, set } from 'firebase/database'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useListVals } from 'react-firebase-hooks/database'
import { Link as RouterLink } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { db } from '../../util/firebase'
import { activeSortedMealPlans } from '../../util/sorting'

import AddDialog from '../../components/add-dialog'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

export default function MealPlans() {
  const r = ref(db, 'meal-plans')
  const [mealplansList, mealplansLoading, error] = useListVals(r)
  const mealplans = activeSortedMealPlans(mealplansList)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const handleAddDialogSubmit = async (name) => {
    setAddLoading(true)
    const id = uuid()
    try {
      await set(ref(db, 'meal-plans/' + id), { id, name })
    } catch (err) {
      // todo: report error
    }
    setAddLoading(false)
    window.location.hash = '/meal-plans/edit/' + id
  }

  const removeMealplan = (id) => async () => {
    setAddLoading(true)
    try {
      await set(ref(db, 'meal-plans/' + id), null)
    } catch (err) {
      // todo: report error
    }
    setAddLoading(false)
  }

  if (error) {
    return (
      <Box sx={{ marginTop: 1 }}>
        <Alert severity="error">
          <AlertTitle>Error:</AlertTitle>
          <pre>
            <code>{error.message}</code>
          </pre>
        </Alert>
      </Box>
    )
  }

  if (mealplansLoading || addLoading) return <Skeleton height={300} />

  return (
    <>
      <Stack direction="row">
        <Typography
          sx={{ flex: '1 1 100%', pt: 0.5 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Meal Plans
        </Typography>

        <AddDialog
          title="Add meal plan"
          open={addDialogOpen}
          setAddDialogOpen={setAddDialogOpen}
          handleSubmit={handleAddDialogSubmit}
        />
        <Tooltip title="Add meal plan">
          <IconButton onClick={() => setAddDialogOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {Object.values(mealplans).map((mealplan) => (
        <Card key={mealplan.id} sx={{ minWidth: 275 }}>
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
                  <IconButton onClick={removeMealplan(mealplan.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>

            {mealplan.days && Object.values(mealplan.days).length && (
              <Typography sx={{ mt: 2 }} color="text.secondary">
                {Object.values(mealplan.days).length} day
                {Object.values(mealplan.days).length > 1 ? 's' : ''}, starts at{' '}
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
      ))}

      {mealplans.length === 0 && (
        <Typography>No Meal Plans yet, create one now!</Typography>
      )}
    </>
  )
}
