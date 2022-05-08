import { useParams } from 'react-router-dom'
import { db } from '../../util/firebase'
import { ref } from 'firebase/database'
import { useObjectVal } from 'react-firebase-hooks/database'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import TimeIcon from '@mui/icons-material/AccessTime'

export default function Recipe() {
  const { id } = useParams()

  const [recipe, loading, error] = useObjectVal(ref(db, 'recipes/' + id))

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

      {!error && !loading && recipe && (
        <Box sx={{ p: 2 }}>
          <Typography variant='h6' sx={{ mb: 1 }}>
            {recipe.name}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={
                <TimeIcon
                  fontSize='small'
                  sx={{ mr: 0.5, verticalAlign: 'bottom' }}
                />
              }
              label={`${recipe.time}min`}
              size='small'
              variant='outlined'
              color='primary'
              sx={{ mt: 1, mr: 1, verticalAlign: 'bottom' }}
            />
            {recipe.tags.map((tag, i) => (
              <Chip
                key={i}
                label={tag}
                size='small'
                variant='outlined'
                sx={{ mt: 1, mr: 1, verticalAlign: 'bottom' }}
              />
            ))}
          </Box>

          <Typography variant='subtitle2' sx={{ mt: 3 }}>
            Ingredients
          </Typography>
          <List>
            {recipe.ingredients.map((ingredient, i) => (
              <ListItem key={i} sx={{ p: 0 }}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </ListItem>
            ))}
          </List>

          <Typography variant='subtitle2' sx={{ mt: 2, mb: 0 }}>
            Steps
          </Typography>
          <List>
            {recipe.steps.map((step, i) => (
              <ListItem
                key={i}
                sx={{
                  ml: 2,
                  p: 0,
                  pb: 1,
                  display: 'list-item',
                  listStyleType: 'decimal',
                }}
              >
                {step.text}
              </ListItem>
            ))}
          </List>

          {recipe.notes && (
            <>
              <Typography variant='subtitle2' sx={{ mt: 2, mb: 0 }}>
                Notes
              </Typography>
              <Typography
                sx={{ mt: 1, mb: 0 }}
                dangerouslySetInnerHTML={{
                  __html: recipe.notes.replace(/\n/g, '<br>'),
                }}
              />
            </>
          )}
        </Box>
      )}
    </Paper>
  )
}
