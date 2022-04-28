import { db } from '../../util/firebase'
import { ref } from 'firebase/database'
import { useList } from 'react-firebase-hooks/database'

export default function Recipes() {
  const r = ref(db, 'recipes')
  const [snapshots, loading, error] = useList(r)

  return (
    <main>
      {error && <>Error!</>}
      {!error && loading && <>Loading...</>}
      {!error && !loading && snapshots && (
        <ol>
          {snapshots.map((v) => (
            <li key={v.key}>
              <code>{JSON.stringify(v.val(), null, 2)}</code>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
