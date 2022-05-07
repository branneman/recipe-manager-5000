import { useState } from 'react'
import { db } from '../../util/firebase'
import { ref } from 'firebase/database'
import { useListVals } from 'react-firebase-hooks/database'

import RecipeTable from '../../components/recipes/RecipeTable'
import RecipeToolbar from '../../components/recipes/RecipeToolbar'

import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

export default function Recipes() {
  const r = ref(db, 'recipes')
  const [recipes, loading, error] = useListVals(r)

  const [selected, setSelected] = useState([])
  const isSelected = (name) => selected.indexOf(name) !== -1

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = recipes.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (_event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  return (
    <main>
      {error && <>Error!</>}
      {!error && loading && <Skeleton />}
      {!error && !loading && recipes && (
        <Paper sx={{ width: '100%', mb: 2 }}>
          <RecipeToolbar numSelected={selected.length} />
          <RecipeTable
            recipes={recipes}
            selected={selected}
            isSelected={isSelected}
            handleClick={handleClick}
            handleSelectAllClick={handleSelectAllClick}
          />
        </Paper>
      )}
    </main>
  )
}
