import { auth } from '../../util/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

import Header from '../header'
import Loader from '../loader'
import Login from '../login'
import Recipes from '../recipes'

import './index.css'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

export default function App() {
  const [user, loading, error] = useAuthState(auth)

  return (
    <>
      {/* Is authentication state is still being loaded? */}
      {loading && <Loader />}

      {/* AuthError returned by Firebase when trying to load the user */}
      {!loading && error && (
        <Box sx={{ marginTop: 1 }}>
          <Alert severity='error'>
            <AlertTitle>Error:</AlertTitle>
            <pre>
              <code>{error.message}</code>
            </pre>
          </Alert>
        </Box>
      )}

      {/* Not logged in */}
      {!loading && !error && !user && <Login />}

      {/* Logged in */}
      {!loading && !error && user && (
        <Container maxWidth='sm' sx={{ mt: 2 }}>
          <Stack justifyContent='flex-start' alignItems='stretch' spacing={2}>
            <Header />
            <Recipes />
          </Stack>
        </Container>
      )}
    </>
  )
}
