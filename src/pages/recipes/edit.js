import { ref, update } from 'firebase/database'
import { concat, remove } from 'ramda'
import { useState } from 'react'
import { useObjectVal } from 'react-firebase-hooks/database'
import { useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { db } from '../../util/firebase'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AddToListIcon from '@mui/icons-material/PlaylistAdd'
import DeleteFromListIcon from '@mui/icons-material/PlaylistRemove'

export default function EditRecipe() {
  const { id } = useParams()

  const [recipe, recipeLoading, error] = useObjectVal(ref(db, 'recipes/' + id))

  const [saveLoading, setSaveLoading] = useState(false)
  const onSubmit = async (event) => {
    event.preventDefault()
    setSaveLoading(true)

    try {
      const formdata = new FormData(event.currentTarget)
      const updateSpec = formDataToUpdateSpec(id, formdata, recipe)
      await update(ref(db), updateSpec)
    } catch (err) {
      // todo: report error
    }

    setSaveLoading(false)
    window.location.hash = '/recipe/' + id
  }

  const [ingredients, setIngredients] = useState(null)
  if (!error && !recipeLoading && recipe && ingredients === null)
    setIngredients(recipe.ingredients || [])
  const addIngredient = () =>
    setIngredients(
      concat(ingredients, [{ id: uuid(), text: '', enabled: true }])
    )
  const deleteIngredient = (key) => () =>
    setIngredients(remove(key, 1, ingredients))

  const [steps, setSteps] = useState(null)
  if (!error && !recipeLoading && steps === null) setSteps(recipe.steps || [])
  const addStep = () =>
    setSteps(concat(steps, [{ id: uuid(), text: '', enabled: true }]))
  const deleteStep = (key) => () => setSteps(remove(key, 1, steps))

  const loading = recipeLoading || saveLoading

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
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ p: 2 }}>
          <TextField
            label="Name"
            name="name"
            defaultValue={recipe.name}
            variant="standard"
            fullWidth
            sx={{ mb: 3 }}
          />
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                label="Persons"
                name="persons"
                defaultValue={recipe.persons}
                variant="standard"
                fullWidth
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Time (minutes)"
                name="time"
                defaultValue={recipe.time}
                variant="standard"
                fullWidth
                sx={{ mb: 3 }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Tags (separated by spaces)"
            name="tags"
            defaultValue={
              Array.isArray(recipe.tags) ? recipe.tags.join(' ') : ''
            }
            variant="standard"
            fullWidth
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Ingredients
          </Typography>
          <List>
            {Array.isArray(ingredients) &&
              ingredients.map((ingredient, i) => (
                <ListItem key={ingredient.id} sx={{ p: 0 }}>
                  <input
                    type="hidden"
                    name={`id-ingredient-${i}`}
                    value={ingredient.id}
                  />
                  <TextField
                    name={`ingredient-${i}`}
                    defaultValue={ingredient.text}
                    variant="standard"
                    fullWidth
                  />
                  <Tooltip title="Delete ingredient">
                    <IconButton
                      onClick={deleteIngredient(i)}
                      sx={{ ml: -1, alignSelf: 'start' }}
                    >
                      <DeleteFromListIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            <ListItem sx={{ p: 0 }}>
              <Tooltip title="Add ingredient">
                <IconButton
                  onClick={addIngredient}
                  sx={{ ml: -1, alignSelf: 'start' }}
                >
                  <AddToListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItem>
          </List>

          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Steps
          </Typography>
          <List>
            {Array.isArray(steps) &&
              steps.map((step, i) => (
                <ListItem key={step.id} sx={{ p: 0, pb: 1 }}>
                  <input type="hidden" name={`id-step-${i}`} value={step.id} />
                  <TextField
                    name={`step-${i}`}
                    multiline
                    defaultValue={step.text}
                    variant="standard"
                    fullWidth
                  />
                  <Tooltip title="Delete step">
                    <IconButton
                      onClick={deleteStep(i)}
                      sx={{ ml: -1, alignSelf: 'start' }}
                    >
                      <DeleteFromListIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            <ListItem sx={{ p: 0 }}>
              <Tooltip title="Add step">
                <IconButton
                  onClick={addStep}
                  sx={{ ml: -1, alignSelf: 'start' }}
                >
                  <AddToListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItem>
          </List>

          <TextField
            label="Notes (multiline)"
            name="notes"
            multiline
            defaultValue={recipe.notes}
            variant="standard"
            fullWidth
            sx={{ mt: 3, mb: 3 }}
          />
          <TextField
            label="Source URL"
            name="source"
            defaultValue={recipe.source}
            variant="standard"
            fullWidth
          />

          <Box>
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Save &amp; Close
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  )
}

export const formDataToUpdateSpec = (id, fd, recipe) => {
  const ops = {}

  // Simple fields
  if (fd.get('name')) ops[`recipes/${id}/name`] = fd.get('name')
  if (fd.get('persons')) ops[`recipes/${id}/persons`] = fd.get('persons')
  if (fd.get('time')) ops[`recipes/${id}/time`] = fd.get('time')
  if (fd.get('notes')) ops[`recipes/${id}/notes`] = fd.get('notes')
  if (fd.get('source')) ops[`recipes/${id}/source`] = fd.get('source')

  // List of tags
  if (fd.get('tags')) ops[`recipes/${id}/tags`] = fd.get('tags').split(' ')

  // List of ingredients
  const ingredients = []
  for (const name of fd.keys()) {
    if (name.substr(0, 11) !== 'ingredient-') continue
    const key = name.substr(11)
    const ingredient = {
      id: fd.get(`id-ingredient-${key}`),
      text: fd.get(name),
      enabled: true,
    }
    if (ingredientExists(recipe, key, ingredient.id))
      ingredient.enabled = recipe.ingredients[key].enabled
    ingredients[key] = ingredient
  }
  ops[`recipes/${id}/ingredients`] = ingredients

  // List of steps
  const steps = []
  for (const name of fd.keys()) {
    if (name.substr(0, 5) !== 'step-') continue
    const key = name.substr(5)
    const step = {
      id: fd.get(`id-step-${key}`),
      text: fd.get(name),
      enabled: true,
    }
    if (stepExists(recipe, key, step.id))
      step.enabled = recipe.steps[key].enabled
    steps[key] = step
  }
  ops[`recipes/${id}/steps`] = steps

  return ops
}

export const ingredientExists = (recipe, key, ingredientId) =>
  recipe.ingredients &&
  recipe.ingredients[key] &&
  recipe.ingredients[key].id &&
  recipe.ingredients[key].id === ingredientId

export const stepExists = (recipe, key, stepId) =>
  recipe.steps &&
  recipe.steps[key] &&
  recipe.steps[key].id &&
  recipe.steps[key].id === stepId
