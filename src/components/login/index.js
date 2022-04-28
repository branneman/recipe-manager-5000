import { useState, useRef } from 'react'
import { auth } from '../../util/firebase'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'

import './index.css'

const KEYCODE_ENTER = 13

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth)

  // Trigger submit when pressing Enter
  const submitRef = useRef(null)
  const handleKeypress = (e) => {
    if (e.charCode === KEYCODE_ENTER) submitRef.current.click()
  }

  return (
    <div className='login'>
      <div className='login__row'>
        <label className='login__label'>Email:</label>
        <input
          className='login__input'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeypress}
        />
      </div>

      <div className='login__row'>
        <label className='login__label'>Password:</label>
        <input
          className='login__input'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeypress}
        />
      </div>

      {/* AuthError returned by Firebase when trying to login the user */}
      {error && (
        <div className='login__row'>
          <p className='login__nolabel login__error'>
            {error2message(error.code)}
          </p>
          <button
            ref={submitRef}
            className='login__nolabel login__submit'
            onClick={() => signInWithEmailAndPassword(email, password)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Is user login still processing? */}
      {!error && loading && (
        <div className='login__nolabel'>
          <p>Loading...</p>
        </div>
      )}

      {/* Not logged in yet, show form */}
      {!error && !loading && !user && (
        <div className='login__row'>
          <button
            ref={submitRef}
            className='login__nolabel login__submit'
            onClick={() => signInWithEmailAndPassword(email, password)}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
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
      return 'Internal error'
  }
}
