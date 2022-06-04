import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ref, set, update } from 'firebase/database'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useObjectVal } from 'react-firebase-hooks/database'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { validate as isUuid, v4 as uuid } from 'uuid'

import { callIfEnterKeyWasPressed } from '../../util/dom'
import { db } from '../../util/firebase'
import { sortedMealplanDays } from '../../util/sorting'
import { capitalise } from '../../util/string'

import ConfirmDialog from '../../components/confirm-dialog'
import RecipeMention from '../../components/recipes/RecipeMention'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AddLink from '@mui/icons-material/AddLink'
import BackIcon from '@mui/icons-material/ArrowBackIosNew'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkOff from '@mui/icons-material/LinkOff'
import AddToListIcon from '@mui/icons-material/PlaylistAdd'

export default function EditMealPlan() {
  const { id } = useParams()

  const [mealplan, mealplanLoading, error] = useObjectVal(
    ref(db, 'meal-plans/' + id)
  )
  const days =
    mealplan && mealplan.days ? sortedMealplanDays(mealplan.days) : null

  const [saveLoading, setSaveLoading] = useState(false)

  const [startDate, setStartDate] = useState(null)
  if (mealplan && mealplan.start && startDate === null)
    setStartDate(mealplan.start)
  const saveStartDate = async (value) => {
    setSaveLoading(true)
    try {
      await set(ref(db, `meal-plans/${mealplan.id}/start`), value)
    } catch (err) {
      // todo: report error
    }
    setStartDate(value)
    setSaveLoading(false)
  }

  const addDay = async () => {
    setSaveLoading(true)
    try {
      const id = uuid()
      const r = ref(db, `meal-plans/${mealplan.id}/days/${id}`)
      await set(r, {
        day: mealplan.days ? Object.entries(mealplan.days).length : 0,
      })
    } catch (err) {
      // todo: report error
    }
    setSaveLoading(false)
  }

  const saveName = async (value) => {
    if (mealplan.name === value) return
    setSaveLoading(true)
    try {
      await set(ref(db, `meal-plans/${mealplan.id}/name`), value)
    } catch (err) {
      // todo: report error
    }
    setSaveLoading(false)
  }

  const saveDay = async (day, meal, value) => {
    if (mealplan.days[day][meal] === value) return
    setSaveLoading(true)
    try {
      const r = ref(db, `meal-plans/${mealplan.id}/days/${day}/${meal}`)
      await set(r, value)
    } catch (err) {
      // todo: report error
    }
    setSaveLoading(false)
  }

  const deleteDay = async (deleteDay) => {
    setSaveLoading(true)
    try {
      const ops = {}

      // Delete a day
      ops[`meal-plans/${mealplan.id}/days/${deleteDay}`] = null

      // Reset `day` numbers
      let dayNumber = -1
      for (const [id] of days) {
        if (id === deleteDay) continue
        ops[`meal-plans/${mealplan.id}/days/${id}/day`] = ++dayNumber
      }
      await update(ref(db), ops)
    } catch (err) {
      // todo: report error
    }
    setSaveLoading(false)
  }

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [confirmDeleteDay, setConfirmDeleteDay] = useState(null)

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

  if (mealplanLoading) return <Skeleton height={300} />

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDeleteDialogOpen}
        setOpen={setConfirmDeleteDialogOpen}
        onConfirm={() => deleteDay(confirmDeleteDay.id)}
        title="Delete day?"
        text={
          <>
            <span style={{ display: 'block', marginBottom: '12px' }}>
              The following day will be deleted from the meal plan:
            </span>
            <span style={{ display: 'block', margin: 0 }}>
              – Day {confirmDeleteDay?.day + 1}:{' '}
              {DateTime.fromISO(mealplan.start)
                .plus({ days: confirmDeleteDay?.day })
                .toFormat('ccc dd LLL')}
            </span>
          </>
        }
        confirmText="Delete"
      />

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={2}>
              <Tooltip title="Back to Meal Plans">
                <IconButton
                  to={`/meal-plans/${id}`}
                  component={RouterLink}
                  sx={{ ml: -1 }}
                  disabled={saveLoading}
                >
                  <BackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="h6" sx={{ mt: 0.5, mb: 1, ml: -1, mr: 1 }}>
                Edit Meal Plan
              </Typography>
            </Grid>
          </Grid>

          <TextField
            label="Name"
            name="name"
            defaultValue={mealplan.name}
            onBlur={(evt) => saveName(evt.target.value)}
            onKeyPress={(evt) =>
              callIfEnterKeyWasPressed(evt, () => evt.target.blur())
            }
            variant="standard"
            fullWidth
            sx={{ mb: 2 }}
          />

          <LocalizationProvider dateAdapter={AdapterLuxon} locale="en-GB">
            <DatePicker
              label="First day"
              value={startDate}
              onChange={(d) => d && saveStartDate(d.toISODate())}
              renderInput={(params) => (
                <TextField {...params} variant="standard" fullWidth />
              )}
            />
          </LocalizationProvider>

          {startDate && days && (
            <Typography variant="body2" sx={{ mt: 3 }}>
              Tip: the Breakfast, Lunch and Dinner fields accept plain/multiline
              text, a URL, or a recipe ID.
            </Typography>
          )}

          {startDate &&
            days &&
            days.map(([id, day]) => (
              <Box key={id}>
                <Grid container spacing={1} sx={{ mt: 4, mb: 1 }}>
                  <Grid item xs={10}>
                    <Typography variant="h5" component="div">
                      Day {day.day + 1}:{' '}
                      {DateTime.fromISO(mealplan.start)
                        .plus({ days: day.day })
                        .toFormat('ccc dd LLL')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'right' }}>
                    <Tooltip title={`Delete day ${day.day + 1}`}>
                      <IconButton
                        onClick={() => {
                          setConfirmDeleteDay({ ...day, id })
                          setConfirmDeleteDialogOpen(true)
                        }}
                        sx={{ mr: -1.5, alignSelf: 'start' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>

                {['breakfast', 'lunch', 'dinner'].map((meal) => (
                  <Stack
                    key={`${id}-${day.day}-${meal}`}
                    direction="row"
                    alignItems="flex-start"
                  >
                    {isUuid(day[meal]) ? (
                      <>
                        <Tooltip title="Delete linked recipe" sx={{ ml: -1 }}>
                          <IconButton
                            onClick={() => saveDay(id, meal, '')}
                            fontSize="small"
                          >
                            <LinkOff />
                          </IconButton>
                        </Tooltip>
                        <RecipeMention
                          id={day[meal]}
                          style={{ marginTop: '8px', fontSize: '16px' }}
                        />
                      </>
                    ) : (
                      <>
                        <Tooltip title="Select a recipe" sx={{ mt: 1, ml: -1 }}>
                          <IconButton
                            component={RouterLink}
                            to={`/meal-plans/select-recipe/${mealplan.id}/${day.day}/${meal}`}
                            fontSize="small"
                          >
                            <AddLink />
                          </IconButton>
                        </Tooltip>
                        <TextField
                          label={capitalise(meal)}
                          name={meal}
                          defaultValue={day[meal]}
                          multiline
                          onBlur={(evt) => saveDay(id, meal, evt.target.value)}
                          variant="standard"
                          fullWidth
                          size="small"
                          sx={{ mb: 2 }}
                        />
                      </>
                    )}
                  </Stack>
                ))}
              </Box>
            ))}

          {!days && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              This is an empty meal plan, start by selecting the first day, then
              adding days.
            </Alert>
          )}

          <Grid container spacing={1} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Button
                onClick={addDay}
                startIcon={<AddToListIcon />}
                disabled={!startDate}
              >
                Add a day
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button
                component={RouterLink}
                to={`/meal-plans/${mealplan.id}`}
                variant="contained"
                sx={{}}
                disabled={saveLoading}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  )
}
