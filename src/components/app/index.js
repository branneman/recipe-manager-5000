import { auth } from '../../util/firebase'
import { signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

import Login from '../login'

import './index.css'

export default function App() {
  const [user, loading, error] = useAuthState(auth)

  return (
    <>
      {/* Is authentication state is still being loaded? */}
      {loading && <div className='layout__container'>Loading...</div>}

      {/* AuthError returned by Firebase when trying to load the user */}
      {!loading && error && (
        <>
          Error:
          <pre>
            <code>{error.message}</code>
          </pre>
        </>
      )}

      {/* Not logged in */}
      {!loading && !error && !user && (
        <div className='layout__container'>
          <Login />
        </div>
      )}

      {/* Logged in */}
      {!loading && !error && user && (
        <div>
          <header>
            {/* todo refactor into its own component */}
            <p>Logged in as: {user.email}</p>
            <button onClick={() => signOut(auth)}>Log out</button>
          </header>
        </div>
      )}
    </>
  )
}
