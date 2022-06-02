import { ref, remove, set } from 'firebase/database'
import { useState } from 'react'
import { useListVals } from 'react-firebase-hooks/database'
import { v4 as uuid } from 'uuid'

import { db } from '../../util/firebase'
import { activeSortedRecipes, findRecipe } from '../../util/sorting'

import ConfirmDialog from '../../components/confirm-dialog'
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

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const handleAddDialogSubmit = async (name) => {
    setAddLoading(true)

    const id = uuid()
    try {
      await set(ref(db, 'recipes/' + id), { id, name })
    } catch (err) {
      // todo: report error
    }

    setAddLoading(false)
    window.location.hash = '/recipe/edit/' + id
  }

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
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
          <Alert severity="error">
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
          <ConfirmDialog
            isOpen={confirmDeleteDialogOpen}
            setOpen={setConfirmDeleteDialogOpen}
            onConfirm={handleDelete}
            title="Delete recipes?"
            text={
              <>
                <span style={{ display: 'block', marginBottom: '12px' }}>
                  The following recipes will be deleted:
                </span>
                {selected.map((id) => (
                  <span key={id} style={{ display: 'block', margin: 0 }}>
                    – {findRecipe(id, recipes).name}
                  </span>
                ))}
              </>
            }
            confirmText="Delete"
          />
          <RecipeToolbar
            numSelected={selected.length}
            addDialogOpen={addDialogOpen}
            setAddDialogOpen={setAddDialogOpen}
            handleAddDialogSubmit={handleAddDialogSubmit}
            handleDelete={() => setConfirmDeleteDialogOpen(true)}
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
