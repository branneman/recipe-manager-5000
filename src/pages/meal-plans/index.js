import { ref, set } from 'firebase/database'
import { DateTime } from 'luxon'
import { values } from 'ramda'
import { useState } from 'react'
import { useListVals } from 'react-firebase-hooks/database'
import { v4 as uuid } from 'uuid'

import { db } from '../../util/firebase'
import { activeSortedMealPlans, getCurrentMealPlans } from '../../util/sorting'

import AddDialog from '../../components/add-dialog'
import MealPlan from '../../components/meal-plan'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'

export default function MealPlans() {
  const now = DateTime.now()

  const r = ref(db, 'meal-plans')
  const [mealplansList, mealplansLoading, error] = useListVals(r)
  const mealplans = activeSortedMealPlans(now)(mealplansList)
  const currentMealPlans = getCurrentMealPlans(now)(mealplansList)

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

  const deleteMealplan = (id) => async (evt) => {
    setAddLoading(true)
    try {
      await set(ref(db, 'meal-plans/' + id), null)
    } catch (err) {
      // todo: report error
    }
    setAddLoading(false)

    window.location.hash = '/meal-plans'
  }

  const onCardClick = (id) => (evt) => {
    // If delete was clicked, deleteMealplan() gets called by another event handler
    if (evt.target.closest('.is-delete-button')) return

    // If card was clicked, act as link
    window.location.hash = `/meal-plans/${id}`
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
      {currentMealPlans.length > 0 && (
        <>
          <Typography
            sx={{ flex: '1 1 100%', pt: 0.5 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Active Meal Plans
          </Typography>
          {values(currentMealPlans).map((mealplan) => (
            <MealPlan
              key={mealplan.id}
              mealplan={mealplan}
              onCardClick={onCardClick}
              deleteMealplan={deleteMealplan}
            />
          ))}
        </>
      )}

      <Stack direction="row">
        <Typography
          sx={{ flex: '1 1 100%', pt: 0.5 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          All Meal Plans
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

      {values(mealplans).map((mealplan) => (
        <MealPlan
          key={mealplan.id}
          mealplan={mealplan}
          onCardClick={onCardClick}
          deleteMealplan={deleteMealplan}
        />
      ))}

      {mealplans.length === 0 && (
        <Typography>No Meal Plans yet, create one now!</Typography>
      )}
    </>
  )
}
