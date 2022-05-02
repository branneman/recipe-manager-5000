import { auth } from '../../util/firebase'
import { signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

export default function Header() {
  const [user] = useAuthState(auth)

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={8}>
        <p>Logged in as: {user.email}</p>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'right' }}>
        <Button variant='outlined' onClick={() => signOut(auth)}>
          Log out
        </Button>
      </Grid>
    </Grid>
  )
}
