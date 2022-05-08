import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { db } from '../../util/firebase'
import { activeSortedRecipes } from '../../util/recipe'
import { ref, set, remove } from 'firebase/database'
import { useListVals } from 'react-firebase-hooks/database'

import RecipeTable from '../../components/recipes/RecipeTable'
import RecipeToolbar from '../../components/recipes/RecipeToolbar'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

export default function Recipes() {
  const [recipesList, recipesLoading, error] = useListVals(ref(db, 'recipes'))
  const recipes = activeSortedRecipes(recipesList)

  const [selected, setSelected] = useState([])
  const isSelected = (id) => selected.indexOf(id) !== -1

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = recipes.map((n) => n.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleSelectOneClick = (_event, id) => {
    const selectedIndex = selected.indexOf(id)

    const newSelected = () => {
      if (selectedIndex === -1) {
        return [].concat(selected, id)
      } else if (selectedIndex === 0) {
        return [].concat(selected.slice(1))
      } else if (selectedIndex === selected.length - 1) {
        return [].concat(selected.slice(0, -1))
      } else if (selectedIndex > 0) {
        return [].concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        )
      }
      return []
    }

    setSelected(newSelected())
  }

  const [addLoading, setAddLoading] = useState(false)
  const handleAddRecipe = async () => {
    setAddLoading(true)

    const id = uuid()
    try {
      await set(ref(db, 'recipes/' + id), {
        id,
        name: `Turkish Potato & Red Lentil Soup`,
        time: 30,
        tags: ['turkish', 'soup', 'dinner', 'lunch'],
        ingredients: [
          {
            amount: '2',
            unit: 'tsp',
            name: 'vegetable oil',
            enabled: true,
          },
          {
            amount: '1',
            unit: 'medium',
            name: 'onion',
            note: 'diced',
            enabled: true,
          },
          {
            amount: '1',
            unit: 'liter',
            name: 'water',
            enabled: true,
          },
          {
            amount: '1',
            unit: '',
            name: 'vegetable bouillon cube',
            note: 'crushed',
            enabled: true,
          },
          {
            amount: '192',
            unit: 'gram',
            name: 'dry red lentils',
            note: 'rinsed',
            enabled: true,
          },
          {
            amount: '1',
            unit: 'medium',
            name: 'potato',
            note: 'diced into 1cm cubes',
            enabled: true,
          },
          {
            amount: '1',
            unit: 'tbsp',
            name: 'paprika powder',
            enabled: true,
          },
          {
            amount: '2',
            unit: 'tsp',
            name: 'onion powder',
            enabled: true,
          },
          {
            amount: '2',
            unit: 'tsp',
            name: 'garlic powder',
            enabled: true,
          },
          {
            amount: '2',
            unit: 'tsp',
            name: 'balsamic vinegar',
            enabled: true,
          },
          {
            amount: '1/8',
            unit: 'tsp',
            name: 'black pepper',
            note: 'ground, or more to taste',
            enabled: true,
          },
          {
            amount: '1',
            unit: 'pinch',
            name: 'salt',
            note: 'or more to taste',
            enabled: true,
          },
        ],
        steps: [
          {
            text: 'Put a large pot on medium-high heat, add the oil. When hot, add the onions and sauté until golden, about in about 5 minutes.',
            enabled: true,
          },
          {
            text: 'Add in the remaining ingredients. Bring to a boil and then reduce to a simmer. Partially cover with a lid and cook for 15 minutes, or until the lentils and potato are cooked through.',
            enabled: true,
          },
          {
            text: 'Taste test, add more salt and pepper to taste, and add more water depending on how you like the consistency of your soup. Garnish, and enjoy!',
            enabled: true,
          },
        ],
        notes:
          'Serve with 3 slices whole wheat bread, toasted.\n\nStore in an airtight container in the fridge for up to 4 days, or in the freezer for up to 2 months.',
      })
    } catch (err) {
      // todo: report error
    }

    setAddLoading(false)
  }

  const [deleteLoading, setDeleteLoading] = useState(false)
  const handleDelete = async () => {
    setDeleteLoading(true)

    try {
      await Promise.all(selected.map((id) => remove(ref(db, 'recipes/' + id))))
    } catch (err) {
      // todo: report error
    }

    setSelected([])
    setDeleteLoading(false)
  }

  const handleAddToMealPlan = () => {}

  const loading = recipesLoading || addLoading || deleteLoading

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {error && (
        <Box sx={{ marginTop: 1 }}>
          <Alert severity='error'>
            <AlertTitle>Error:</AlertTitle>
            <pre>
              <code>{error.message}</code>
            </pre>
          </Alert>
        </Box>
      )}

      {!error && loading && <Skeleton height={300} />}

      {!error && !loading && recipes && (
        <>
          <RecipeToolbar
            numSelected={selected.length}
            handleAddRecipe={handleAddRecipe}
            handleDelete={handleDelete}
            handleAddToMealPlan={handleAddToMealPlan}
          />
          <RecipeTable
            recipes={recipes}
            selected={selected}
            isSelected={isSelected}
            handleSelectOneClick={handleSelectOneClick}
            handleSelectAllClick={handleSelectAllClick}
          />
        </>
      )}
    </Paper>
  )
}
