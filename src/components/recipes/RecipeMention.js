import { ref } from 'firebase/database'
import { useObjectVal } from 'react-firebase-hooks/database'
import { Link as RouterLink } from 'react-router-dom'

import { db } from '../../util/firebase'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

export default function RecipeMention(props) {
  const { id } = props

  const [recipe, loading, error] = useObjectVal(ref(db, 'recipes/' + id))

  if (error)
    return (
      <Alert severity="error">
        <AlertTitle>Could not load recipe</AlertTitle>
      </Alert>
    )

  if (loading) return <Skeleton />

  return (
    <Typography
      component={RouterLink}
      to={`/recipe/${recipe.id}`}
      color="text.primary"
      style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        textDecoration: 'none',
      }}
    >
      {recipe.name}
    </Typography>
  )
}
