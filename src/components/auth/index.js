import AuthContext from '../../context/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../../util/firebase'

import Login from '../../pages/login'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'

export default function Auth(props) {
  const [user, loading, error] = useAuthState(auth)

  // Is authentication state is still being loaded?
  if (loading) return null

  // AuthError returned by Firebase when trying to load the user
  if (error)
    return (
      <Box sx={{ marginTop: 1 }}>
        <Alert severity="error">
          <AlertTitle>Error while logging in:</AlertTitle>
          <pre>
            <code>{error.message}</code>
          </pre>
        </Alert>
      </Box>
    )

  // User is not logged in yet
  if (!user) return <Login />

  // Logged In
  if (user)
    return (
      <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
    )
}
