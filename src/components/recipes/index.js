import { useState } from 'react'
import { db } from '../../util/firebase'
import { ref } from 'firebase/database'
import { useListVals } from 'react-firebase-hooks/database'
import { totalCalories, totalCarbs } from '../../util/recipe'

import TableToolbar from './TableToolbar'

import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

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
          <TableToolbar numSelected={selected.length} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                      indeterminate={
                        selected.length > 0 && selected.length < recipes.length
                      }
                      checked={
                        recipes.length > 0 && selected.length === recipes.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align='right'>Kcal</TableCell>
                  <TableCell align='right'>Carbs</TableCell>
                  <TableCell align='right'>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipes.map((recipe) => (
                  <TableRow
                    role='checkbox'
                    key={recipe.name}
                    selected={isSelected(recipe.name)}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        checked={isSelected(recipe.name)}
                        onClick={(event) => handleClick(event, recipe.name)}
                      />
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {recipe.name}
                    </TableCell>
                    <TableCell align='right'>{totalCalories(recipe)}</TableCell>
                    <TableCell align='right'>{totalCarbs(recipe)}</TableCell>
                    <TableCell align='right'>{recipe.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </main>
  )
}
