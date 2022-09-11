import { ref } from 'firebase/database'
import { useObjectVal } from 'react-firebase-hooks/database'
import { Link as RouterLink } from 'react-router-dom'

import { db } from '../../util/firebase'

import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { grey } from '@mui/material/colors'

export default function RecipeMention(props) {
  const { id, style, ingredients } = props

  const [recipe, loading, error] = useObjectVal(ref(db, 'recipes/' + id))

  if (error || (!loading && recipe === null))
    return <Alert severity="error">Could not load recipe</Alert>

  if (loading) return <Skeleton />

  const showIngredients =
    ingredients === true && Array.isArray(recipe.ingredients)

  return (
    <Typography
      component={RouterLink}
      to={`/recipe/${recipe.id}`}
      color="text.primary"
      style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        ...(style || {}),
      }}
    >
      {recipe.name}
      {recipe.persons && ` (${recipe.persons}p)`}
      {showIngredients && (
        <Typography
          style={{
            fontSize: '0.75rem',
            textDecoration: 'none',
            color: grey[600],
            ...(style || {}),
          }}
        >
          {recipe.ingredients
            .map((i) => i.text)
            .filter(Boolean)
            .join(', ')}
        </Typography>
      )}
    </Typography>
  )
}
