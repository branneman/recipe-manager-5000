import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'

import App from './components/app'
import Auth from './components/auth'
import Recipes from './pages/recipes'
import Recipe from './pages/recipe'
import EditRecipe from './pages/recipe/edit'
import ShoppingList from './pages/shopping-list'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <Auth>
      <HashRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Recipes />} />
            <Route path='recipes' element={<Recipes />} />
            <Route path='recipe/:id' element={<Recipe />} />
            <Route path='recipe/edit/:id' element={<EditRecipe />} />
            <Route path='meal-plans' element={<p>Meal Plans</p>} />
            <Route path='shopping-list' element={<ShoppingList />} />
          </Route>
          <Route path='*' element={<p>404 Page Not Found</p>} />
        </Routes>
      </HashRouter>
    </Auth>
  </React.StrictMode>
)
