import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import App from './components/app'
import Recipes from './pages/recipes'
import Recipe from './pages/recipe'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <CssBaseline />
    <HashRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Recipes />} />
          <Route path='recipes' element={<Recipes />} />
          <Route path='recipe/:id' element={<Recipe />} />
          <Route path='meal-plans' element={<p>Meal Plans</p>} />
          <Route path='shopping-list' element={<p>Shopping List</p>} />
        </Route>
        <Route path='*' element={<p>404 Page Not Found</p>} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
