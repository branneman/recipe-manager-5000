import { ref, set, update } from 'firebase/database'
import { DateTime } from 'luxon'
import { filter, prop, toPairs } from 'ramda'
import { useListVals, useObjectVal } from 'react-firebase-hooks/database'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { db } from '../../util/firebase'
import { activeSortedShoppingList } from '../../util/sorting'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import TimeIcon from '@mui/icons-material/AccessTime'
import BackIcon from '@mui/icons-material/ArrowBackIosNew'
import EditIcon from '@mui/icons-material/Edit'
import AddToListIcon from '@mui/icons-material/PlaylistAdd'

export default function ViewRecipe() {
  const { id } = useParams()

  const [recipe, recipeLoading, recipeError] = useObjectVal(
    ref(db, 'recipes/' + id)
  )
  const [rawList, listLoading, listError] = useListVals(
    ref(db, 'shopping-list')
  )
  const list = activeSortedShoppingList(rawList)
  const loading = recipeLoading || listLoading
  const error = recipeError || listError

  const addIngredientsToShoppingList = async () => {
    const ingredientsToAdd = filter(prop('enabled'), recipe.ingredients)
    console.log('ingredientsToAdd', ingredientsToAdd)

    for (const [i, ingredient] of toPairs(ingredientsToAdd)) {
      const id = uuid()
      const now = DateTime.now().toUTC().toISO()
      await set(ref(db, 'shopping-list/' + id), {
        id,
        text: ingredient.text,
        created: now,
        lastUpdated: now,
        order: Number(list.length) + Number(i) + 1,
      })
    }
  }

  const toggleIngredient = (ingredientId) => async () => {
    try {
      update(ref(db), {
        [`recipes/${id}/ingredients/${ingredientId}/enabled`]:
          !recipe.ingredients[ingredientId].enabled,
      })
    } catch (err) {
      // todo: report error
    }
  }

  const toggleStep = (stepId) => async () => {
    try {
      update(ref(db), {
        [`recipes/${id}/steps/${stepId}/enabled`]:
          !recipe.steps[stepId].enabled,
      })
    } catch (err) {
      // todo: report error
    }
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {error && (
        <Box sx={{ marginTop: 1 }}>
          <Alert severity="error">
            <AlertTitle>Error:</AlertTitle>
            <pre>
              <code>{error.message}</code>
            </pre>
          </Alert>
        </Box>
      )}

      {!error && loading && <Skeleton height={300} />}

      {!error && !loading && recipe && (
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Tooltip title="Back to Recipes">
                <IconButton
                  to="/recipes"
                  component={RouterLink}
                  sx={{ ml: -1 }}
                >
                  <BackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ mt: 0.5, mb: 1, ml: -1, mr: 1 }}>
                {recipe.name}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'right' }}>
              <Tooltip title="Edit recipe">
                <IconButton
                  component={RouterLink}
                  to={`/recipe/edit/${recipe.id}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {(recipe.time || recipe.tags) && (
            <Box sx={{ mb: 2 }}>
              {recipe.time && (
                <Chip
                  icon={
                    <TimeIcon
                      fontSize="small"
                      sx={{ mr: 0.5, verticalAlign: 'bottom' }}
                    />
                  }
                  label={`${recipe.time}min`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 1, mr: 1, verticalAlign: 'bottom' }}
                />
              )}
              {recipe.tags &&
                recipe.tags.length &&
                recipe.tags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1, mr: 1, verticalAlign: 'bottom' }}
                  />
                ))}
            </Box>
          )}

          {recipe.ingredients && recipe.ingredients.length && (
            <Grid container spacing={1} sx={{ mt: 3 }}>
              <Grid item xs={10}>
                <Typography variant="subtitle2" sx={{ display: 'block' }}>
                  Ingredients
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ mt: -1, textAlign: 'right' }}>
                <Tooltip title="Add to shoppinglist">
                  <IconButton onClick={addIngredientsToShoppingList}>
                    <AddToListIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <List>
                {recipe.ingredients.map((ingredient, i) => (
                  <ListItem
                    key={i}
                    sx={{ p: 0, pl: 1, cursor: 'pointer' }}
                    disabled={!ingredient.enabled}
                    onClick={toggleIngredient(i)}
                  >
                    {ingredient.text}
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}

          {recipe.steps && recipe.steps.length && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0 }}>
                Steps
              </Typography>
              <List>
                {recipe.steps.map((step, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      ml: 2,
                      p: 0,
                      pb: 1,
                      pr: 1,
                      display: 'list-item',
                      listStyleType: 'decimal',
                      cursor: 'pointer',
                    }}
                    disabled={!step.enabled}
                    onClick={toggleStep(i)}
                  >
                    {step.text}
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {recipe.notes && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 0 }}>
                Notes
              </Typography>
              <Typography
                sx={{ mt: 1, mb: 0 }}
                dangerouslySetInnerHTML={{
                  __html: recipe.notes.replace(/\n+/g, '<br>'),
                }}
              />
            </>
          )}

          {recipe.source && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 0 }}>
                Source
              </Typography>
              <Typography sx={{ mt: 1, mb: 0 }}>
                {recipe.source && recipe.source.substr(0, 4) === 'http' && (
                  <Link target="_blank" href={recipe.source}>
                    {recipe.source}
                  </Link>
                )}
                {recipe.source &&
                  recipe.source.substr(0, 4) !== 'http' &&
                  recipe.source}
              </Typography>
            </>
          )}
        </Box>
      )}
    </Paper>
  )
}
