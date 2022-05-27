import Loader from '../loader'
import { ref } from 'firebase/database'
import { useObjectVal } from 'react-firebase-hooks/database'

import { db } from '../../util/firebase'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export default function UpdateCheck(props) {
  const { appVersion } = props

  const [dbVersion, loading, error] = useObjectVal(ref(db, 'version'))

  if (loading) return <Loader />

  if (error) {
    return (
      <Box sx={{ marginTop: 1 }}>
        <Alert severity="error">
          <AlertTitle>Error:</AlertTitle>
          <pre>
            <code>{error.message}</code>
          </pre>
        </Alert>
      </Box>
    )
  }

  // Version mismatch
  if (dbVersion !== appVersion) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Alert severity="warning">
          <AlertTitle>An update has been released.</AlertTitle>
          To continue, you need to refresh the page.
          <Button
            variant="outlined"
            sx={{ display: 'block', mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Alert>
      </Box>
    )
  }

  // Matching versions: pass through
  return props.children
}
