import { useParams, Link as RouterLink } from 'react-router-dom'
import { db } from '../../util/firebase'
import { sortedMealplanDays } from '../../util/sorting'
import { ref } from 'firebase/database'
import { useObjectVal } from 'react-firebase-hooks/database'
import { validate as isUuid } from 'uuid'
import { DateTime } from 'luxon'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import BackIcon from '@mui/icons-material/ArrowBackIosNew'
import EditIcon from '@mui/icons-material/Edit'

export default function ViewMealPlan() {
  const { id } = useParams()

  const [mealplan, loading, error] = useObjectVal(ref(db, 'meal-plans/' + id))
  const days =
    mealplan && mealplan.days ? sortedMealplanDays(mealplan.days) : null

  if (error) {
    return (
      <Box sx={{ marginTop: 1 }}>
        <Alert severity='error'>
          <AlertTitle>Error:</AlertTitle>
          <pre>
            <code>{error.message}</code>
          </pre>
        </Alert>
      </Box>
    )
  }

  if (loading) return <Skeleton height={300} />

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Tooltip title='Back to Meal Plans'>
              <IconButton
                to='/meal-plans'
                component={RouterLink}
                sx={{ ml: -1 }}
              >
                <BackIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={8}>
            <Typography variant='h6' sx={{ mt: 0.5, mb: 1, ml: -1, mr: 1 }}>
              {mealplan.name}
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'right' }}>
            <Tooltip title='Edit Meal Plan'>
              <IconButton
                component={RouterLink}
                to={`/meal-plans/edit/${mealplan.id}`}
              >
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        {days &&
          days.map(([id, day]) => (
            <Box key={id} sx={{ mt: 2 }}>
              <Typography
                variant='h6'
                component='div'
                sx={{ fontSize: '18px' }}
              >
                Day {day.day + 1}:{' '}
                {DateTime.fromISO(mealplan.start)
                  .plus({ days: day.day })
                  .toFormat('ccc dd LLL')}
              </Typography>
              <Table size='small'>
                <TableBody>
                  {['breakfast', 'lunch', 'dinner'].map(
                    (meal) =>
                      day[meal] && (
                        <TableRow key={`${id}-${meal}`}>
                          <TableCell
                            sx={{
                              p: 0.75,
                              pl: 0,
                              width: 12,
                              verticalAlign: 'top',
                            }}
                          >
                            {capitalise(meal)}:
                          </TableCell>
                          <TableCell sx={{ p: 0.75, pr: 0 }}>
                            <RecipeMeal text={day[meal]} />
                          </TableCell>
                        </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            </Box>
          ))}
      </Box>
    </Paper>
  )
}

function RecipeMeal(props) {
  const { text } = props

  if (isUuid(text)) return <RecipeMention id={text} />
  if (text.startsWith('http')) return <Link href={text}>{text}</Link>
  return text
}

function RecipeMention(props) {
  const { id } = props

  const [recipe, loading, error] = useObjectVal(ref(db, 'recipes/' + id))

  if (error)
    return (
      <Alert severity='error'>
        <AlertTitle>Could not load recipe</AlertTitle>
      </Alert>
    )

  if (loading) return <Skeleton />

  return (
    <Typography
      component={RouterLink}
      to={`/recipe/${recipe.id}`}
      color='text.primary'
      style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        textDecoration: 'none',
      }}
    >
      {recipe.name}
    </Typography>
  )
}

function capitalise(s) {
  return s.substr(0, 1).toUpperCase() + s.substr(1)
}
