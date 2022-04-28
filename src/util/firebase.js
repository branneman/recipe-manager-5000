import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAY0NnZNi8YwcoOl-QXx4AdfGjWl2EHPWQ',
  authDomain: 'recipe-manager-5000.firebaseapp.com',
  projectId: 'recipe-manager-5000',
  storageBucket: 'recipe-manager-5000.appspot.com',
  databaseURL:
    'https://recipe-manager-5000-default-rtdb.europe-west1.firebasedatabase.app',
  messagingSenderId: '350783515773',
  appId: '1:350783515773:web:6062d6234a7de52ae81514',
}

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)
export const auth = getAuth(app)

export default app
