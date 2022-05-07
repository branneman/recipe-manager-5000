import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { compose, prop, uniqBy, sortBy } from 'ramda'
import { db } from '../../util/firebase'
import { ref, set, remove } from 'firebase/database'
import { useListVals } from 'react-firebase-hooks/database'

import RecipeTable from '../../components/recipes/RecipeTable'
import RecipeToolbar from '../../components/recipes/RecipeToolbar'

import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

export default function Recipes() {
  const [recipesList, recipesLoading, error] = useListVals(ref(db, 'recipes'))
  const recipes = compose(sortBy(prop('name')), uniqBy(prop('id')))(recipesList)

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

  const handleClick = (_event, id) => {
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
        ingredients: [
          {
            amount: '500',
            calories: 750,
            carbs: 120,
            name: 'lamb',
            unit: 'gram',
          },
          {
            amount: '1000',
            calories: 150,
            carbs: 250,
            name: 'spinach',
            unit: 'gram',
          },
        ],
        name: `Saag gosht lamb (${Math.floor(Math.random() * 99999)})`,
        steps: ['first do this', 'then do that'],
        tags: ['indian', 'curry', 'dinner'],
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
    <main>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {error && <>Error!</>}
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
              handleClick={handleClick}
              handleSelectAllClick={handleSelectAllClick}
            />
          </>
        )}
      </Paper>
    </main>
  )
}
