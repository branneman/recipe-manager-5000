import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import App from './components/app'
import Recipes from './pages/recipes'
import Recipe from './pages/recipe'
import EditRecipe from './pages/recipe/edit'

const darkTheme = createTheme({ palette: { mode: 'dark' } })

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Recipes />} />
            <Route path='recipes' element={<Recipes />} />
            <Route path='recipe/:id' element={<Recipe />} />
            <Route path='recipe/edit/:id' element={<EditRecipe />} />
            <Route path='meal-plans' element={<p>Meal Plans</p>} />
            <Route path='shopping-list' element={<p>Shopping List</p>} />
          </Route>
          <Route path='*' element={<p>404 Page Not Found</p>} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
)
