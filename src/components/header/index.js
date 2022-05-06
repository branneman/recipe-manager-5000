import { auth, db } from '../../util/firebase'
import { signOut } from 'firebase/auth'
import { ref } from 'firebase/database'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useObjectVal } from 'react-firebase-hooks/database'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export default function Header() {
  const [user] = useAuthState(auth)
  const r = ref(db, 'users/' + user.uid)
  const [userData, loading, error] = useObjectVal(r)

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={8}>
        {!error && !loading && userData && (
          <Typography>Welcome {userData.name}!</Typography>
        )}
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'right' }}>
        <Button variant='outlined' onClick={() => signOut(auth)}>
          Log out
        </Button>
      </Grid>
    </Grid>
  )
}
