import { useState } from 'react'
import { auth } from '../../util/firebase'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'

import Loader from '../../components/loader'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import Logo from './logo.png'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export default function Login() {
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth)

  // Handle form sumit events (all cases: enter press, button click)
  const handleSubmit = (event) => {
    event.preventDefault()
    const credentials = new FormData(event.currentTarget)
    signInWithEmailAndPassword(
      credentials.get('email'),
      credentials.get('password')
    )
  }

  // Password toggle visibility
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  })
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    })
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <Container maxWidth='sm'>
      {/* Is user login still processing? */}
      {!error && loading && <Loader />}

      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          alt='RECIPE MANAGER 5000'
          src={Logo}
          variant='square'
          sx={{ width: 72, height: 72, mb: 2 }}
        />
        <Typography variant='h5' component='h1' sx={{ mb: 2 }}>
          RECIPE MANAGER 5000
        </Typography>

        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email'
            name='email'
            autoComplete='email'
            autoFocus
          />

          <FormControl variant='outlined' fullWidth margin='normal'>
            <InputLabel htmlFor='password'>Password</InputLabel>
            <OutlinedInput
              id='password'
              autoComplete='current-password'
              required
              name='password'
              label='Password'
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* AuthError returned by Firebase when trying to login the user */}
          {error && (
            <Box sx={{ mt: 1 }}>
              <Alert severity='error'>{error2message(error.code)}</Alert>
            </Box>
          )}

          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

function error2message(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
    case 'auth/invalid-password':
    case 'auth/wrong-password':
      return 'Invalid credentials'

    case 'auth/internal-error':
    default:
      return 'Error'
  }
}
