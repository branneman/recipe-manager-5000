import { ref, remove, set } from 'firebase/database'
import {
  complement,
  concat,
  equals,
  filter,
  flatten,
  intersection,
  map,
  pipe,
  prop,
  sort,
  uniq,
} from 'ramda'
import { useState } from 'react'
import { useListVals } from 'react-firebase-hooks/database'
import { v4 as uuid } from 'uuid'

import { db } from '../../util/firebase'
import { activeSortedRecipes, findRecipe, search } from '../../util/sorting'

import ConfirmDialog from '../../components/confirm-dialog'
import RecipeTable from '../../components/recipes/RecipeTable'
import RecipeToolbar from '../../components/recipes/RecipeToolbar'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

import SearchIcon from '@mui/icons-material/Search'

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

  // prettier-ignore
  const [filters, setFilters] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filterIsActive = (tag) => filters.includes(tag)
  const toggleFilter = (tag) =>
    setFilters(
      filterIsActive(tag)
        ? filter(complement(equals(tag)), filters)
        : concat(filters, [tag])
    )

  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredRecipes = filterSearchRecipesOnTags(recipes, filters, query)

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
            filters={filters}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
          />
          {filtersOpen && (
            <Stack direction="row" sx={{ ml: 2, mr: 2, flexWrap: 'wrap' }}>
              {allTags(recipes).map((tag) => (
                <Chip
                  key={`filter-tag-${tag}`}
                  onClick={() => toggleFilter(tag)}
                  label={tag}
                  variant={filterIsActive(tag) ? 'filled' : 'outlined'}
                  {...(filterIsActive(tag) ? { color: 'primary' } : {})}
                  size="small"
                  sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
                />
              ))}
            </Stack>
          )}
          {searchOpen && (
            <Stack direction="row" sx={{ ml: 2, mr: 2, flexWrap: 'wrap' }}>
              <FormControl variant="outlined" fullWidth sx={{ mt: 2, mb: 2 }}>
                <OutlinedInput
                  name="search"
                  value={query}
                  onChange={(evt) => setQuery(evt.target.value)}
                  placeholder="Search..."
                  size="small"
                  variant="outlined"
                  error={Boolean(
                    query.length && query.length >= 1 && query.length <= 2
                  )}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Stack>
          )}

          <RecipeTable
            recipes={filteredRecipes}
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

const allTags = pipe(
  map(prop('tags')),
  flatten,
  uniq,
  sort((a, b) => a.localeCompare(b))
)

function filterSearchRecipesOnTags(recipes, filters, query) {
  let results = recipes

  if (filters.length)
    results = filter(
      (recipe) => intersection(recipe.tags || [], filters).length,
      recipes
    )

  if (query) results = search(results, query)

  return results
}
