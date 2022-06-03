import { ref, set } from 'firebase/database'
import { DateTime } from 'luxon'
import { filter } from 'ramda'
import { useState } from 'react'
import { useListVals, useObjectVal } from 'react-firebase-hooks/database'
import { Link as RouterLink, useParams } from 'react-router-dom'

import { db } from '../../util/firebase'
import { activeSortedRecipes, sortedMealplanDays } from '../../util/sorting'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import AddLink from '@mui/icons-material/AddLink'
import SearchIcon from '@mui/icons-material/Search'

export default function SelectRecipe() {
  const { id: mealplanId, day: dayNr, meal } = useParams()

  const [mealplan, mealplanLoading, mealplanError] = useObjectVal(
    ref(db, 'meal-plans/' + mealplanId)
  )
  const days =
    mealplan && mealplan.days ? sortedMealplanDays(mealplan.days) : null

  const [recipesList, recipesLoading, recipesError] = useListVals(
    ref(db, 'recipes')
  )
  const recipes = activeSortedRecipes(recipesList)

  const [saveLoading, setSaveLoading] = useState(false)
  const [query, setQuery] = useState('')

  const error = mealplanError || recipesError
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

  const loading = mealplanLoading || recipesLoading || saveLoading
  if (loading) return <Skeleton height={300} />

  const results = search(recipes, query)

  const linkRecipe = (recipeId) => async (evt) => {
    setSaveLoading(true)
    try {
      const dayId = days[dayNr][0]
      const r = ref(db, `meal-plans/${mealplan.id}/days/${dayId}/${meal}`)
      await set(r, recipeId)
    } catch (err) {
      // todo: report error
    }
    setSaveLoading(false)
    window.location.hash = '/meal-plans/edit/' + mealplanId
  }

  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Select Recipe
      </Typography>
      <Typography>
        For {mealplan.name}, day {Number(dayNr) + 1} (
        {DateTime.fromISO(mealplan.start)
          .plus({ days: dayNr })
          .toFormat('ccc dd LLL')}
        ), {meal}
      </Typography>

      <FormControl variant="outlined" fullWidth sx={{ mt: 2, mb: 2 }}>
        <OutlinedInput
          name="search"
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
          placeholder="Search..."
          size="small"
          variant="outlined"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </FormControl>

      {results && (
        <List>
          {results.map((recipe) => (
            <ListItem
              key={recipe.id}
              sx={{ pl: 0, justifyContent: 'flex-start' }}
              secondaryAction={
                <IconButton
                  onClick={linkRecipe(recipe.id)}
                  edge="end"
                  sx={{ top: 2, right: 0, mr: -3 }}
                >
                  <AddLink />
                </IconButton>
              }
            >
              <Link
                component={RouterLink}
                to={`/recipe/${recipe.id}`}
                sx={{
                  display: 'block',
                  color: 'text.primary',
                  textDecoration: 'none',
                }}
              >
                {recipe.name}
              </Link>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  )
}

function search(recipes, q) {
  if (q.length <= 2) return []

  const isMatch = (recipe) => {
    if (recipe.name.toLowerCase().includes(q.toLowerCase())) return true
    if (recipe.tags.includes(q)) return true
  }

  return filter(isMatch, recipes)
}
