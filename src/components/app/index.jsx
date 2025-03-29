import pkg from '../../../package.json'
import AuthContext from '../../context/auth'
import Header from '../header'
import Loader from '../loader'
import UpdateCheck from '../update-check'
import './index.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ref } from 'firebase/database'
import { useContext } from 'react'
import { useObjectVal } from 'react-firebase-hooks/database'
import { Outlet } from 'react-router-dom'

import { db } from '../../util/firebase'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'

export default function App() {
  const user = useContext(AuthContext)
  const r = ref(db, `users/${user.uid}/theme-mode`)
  const [themeMode, themeModeLoading, themeModeError] = useObjectVal(r)

  if (themeModeLoading) return <Loader />

  if (themeModeError)
    return (
      <Box sx={{ marginTop: 1 }}>
        <Alert severity="error">
          <AlertTitle>Error while loading theme:</AlertTitle>
          <pre>
            <code>{themeModeError.message}</code>
          </pre>
        </Alert>
      </Box>
    )

  const theme = createTheme({ palette: { mode: themeMode } })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <UpdateCheck appVersion={pkg.version}>
          <Stack
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Header version={pkg.version} user={user} />
            <Outlet />
          </Stack>
        </UpdateCheck>
      </Container>
    </ThemeProvider>
  )
}
