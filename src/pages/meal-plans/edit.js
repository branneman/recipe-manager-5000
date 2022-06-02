import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ref, set, update } from 'firebase/database'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useObjectVal } from 'react-firebase-hooks/database'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { callIfEnterKeyWasPressed } from '../../util/dom'
import { db } from '../../util/firebase'
import { sortedMealplanDays } from '../../util/sorting'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import BackIcon from '@mui/icons-material/ArrowBackIosNew'
import DeleteIcon from '@mui/icons-material/Delete'
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

  const deleteDay = (deleteDay) => async () => {
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
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Box noValidate sx={{ p: 2 }}>
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
            onChange={(d) => saveStartDate(d.toISODate())}
            renderInput={(params) => (
              <TextField {...params} variant="standard" fullWidth />
            )}
          />
        </LocalizationProvider>

        {days && (
          <Typography variant="body2" sx={{ mt: 3 }}>
            Tip: the Breakfast, Lunch and Dinner fields accepts plain text, a
            link, or a recipe ID
          </Typography>
        )}

        {days &&
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
                      onClick={deleteDay(id)}
                      sx={{ mr: -1.5, alignSelf: 'start' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <TextField
                label="Breakfast"
                name="breakfast"
                defaultValue={day.breakfast}
                onBlur={(evt) => saveDay(id, 'breakfast', evt.target.value)}
                onKeyPress={(evt) =>
                  callIfEnterKeyWasPressed(evt, () => evt.target.blur())
                }
                variant="standard"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Lunch"
                name="lunch"
                defaultValue={day.lunch}
                onBlur={(evt) => saveDay(id, 'lunch', evt.target.value)}
                onKeyPress={(evt) =>
                  callIfEnterKeyWasPressed(evt, () => evt.target.blur())
                }
                variant="standard"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Dinner"
                name="dinner"
                defaultValue={day.dinner}
                onBlur={(evt) => saveDay(id, 'dinner', evt.target.value)}
                onKeyPress={(evt) =>
                  callIfEnterKeyWasPressed(evt, () => evt.target.blur())
                }
                variant="standard"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Box>
          ))}

        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Button onClick={addDay} startIcon={<AddToListIcon />}>
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
  )
}
