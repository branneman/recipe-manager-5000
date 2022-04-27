import { useState, useEffect } from 'react'
import firebase from '../../util/firebase'
import { getDatabase, ref, set, onValue } from 'firebase/database'

import './index.css'

function writeData(userId, someData) {
  const db = getDatabase()
  const r = ref(db, 'users/' + userId)
  set(r, { someData })
}

function App() {
  const [data, setState] = useState('Loading...')

  useEffect(() => {
    const db = getDatabase(firebase)
    const r = ref(db, 'users')
    onValue(r, (snapshot) => {
      setState(snapshot.val())
    })
  })

  return (
    <div>
      <header>
        <button onClick={() => writeData('b625e17', +new Date())}>write</button>
        <div>
          <code style={{ textAlign: 'left', whiteSpace: 'pre' }}>
            {JSON.stringify(data, null, 2)}
          </code>
        </div>
      </header>
    </div>
  )
}

export default App
