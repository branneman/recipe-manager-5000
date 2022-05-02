import { db } from '../../util/firebase'
import { ref } from 'firebase/database'
import { useList } from 'react-firebase-hooks/database'

import { DataGrid } from '@mui/x-data-grid'

export default function Recipes() {
  const r = ref(db, 'recipes')
  const [snapshots, loading, error] = useList(r)

  const cols = [
    { field: 'name', headerName: 'Name' },
    { field: 'ingredients', headerName: '# Ingredients' },
  ]

  function rows(snapshots) {
    return snapshots.map((v) => {
      const val = v.val()
      return {
        id: v.key,
        name: val.name,
        ingredients: val.ingredients.length,
      }
    })
  }

  return (
    <main>
      {error && <>Error!</>}
      {!error && loading && <>Loading...</>}
      {!error && !loading && snapshots && (
        <DataGrid autoHeight rows={rows(snapshots)} columns={cols} />
      )}
    </main>
  )
}
