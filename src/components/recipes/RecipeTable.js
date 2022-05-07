import { totalCalories, totalCarbs } from '../../util/recipe'

import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function RecipeTable(props) {
  const { recipes, selected, isSelected, handleClick, handleSelectAllClick } =
    props

  return (
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
              key={recipe.id}
              selected={isSelected(recipe.id)}
            >
              <TableCell padding='checkbox'>
                <Checkbox
                  color='primary'
                  checked={isSelected(recipe.id)}
                  onClick={(event) => handleClick(event, recipe.id)}
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
  )
}
