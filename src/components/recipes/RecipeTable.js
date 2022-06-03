import { Link as RouterLink } from 'react-router-dom'

import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

export default function RecipeTable(props) {
  const {
    recipes,
    selected,
    isSelected,
    handleSelectOneClick,
    handleSelectAllClick,
  } = props

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
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
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {recipes.map((recipe) => (
            <TableRow
              key={recipe.id}
              role="checkbox"
              selected={isSelected(recipe.id)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isSelected(recipe.id)}
                  onClick={(event) => handleSelectOneClick(event, recipe.id)}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                <RouterLink
                  to={`/recipe/${recipe.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography variant="subtitle2" color="text.primary">
                    {recipe.name}
                  </Typography>
                </RouterLink>
              </TableCell>
              <TableCell align="right">{recipe.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
