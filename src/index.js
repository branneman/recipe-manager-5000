import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'

import App from './components/app'
import Auth from './components/auth'

import Recipes from './pages/recipes'
import ViewRecipe from './pages/recipes/view'
import EditRecipe from './pages/recipes/edit'

import MealPlans from './pages/meal-plans'
import ViewMealPlan from './pages/meal-plans/view'
import EditMealPlan from './pages/meal-plans/edit'

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
            <Route path='recipe/:id' element={<ViewRecipe />} />
            <Route path='recipe/edit/:id' element={<EditRecipe />} />
            <Route path='meal-plans' element={<MealPlans />} />
            <Route path='meal-plans/:id' element={<ViewMealPlan />} />
            <Route path='meal-plans/edit/:id' element={<EditMealPlan />} />
            <Route path='shopping-list' element={<ShoppingList />} />
          </Route>
          <Route path='*' element={<p>404 Page Not Found</p>} />
        </Routes>
      </HashRouter>
    </Auth>
  </React.StrictMode>
)
