import { Outlet } from 'react-router-dom'
import { auth } from '../../util/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import pkg from '../../../package.json'

import Login from '../../pages/login'
import Header from '../header'
import Loader from '../loader'
import UpdateCheck from '../update-check'

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
          <UpdateCheck appVersion={pkg.version}>
            <Stack justifyContent='flex-start' alignItems='stretch' spacing={2}>
              <Header version={pkg.version} />
              <Outlet />
            </Stack>
          </UpdateCheck>
        </Container>
      )}
    </>
  )
}
