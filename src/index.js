import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'

import MealPlans from './pages/meal-plans'
import EditMealPlan from './pages/meal-plans/edit'
import ViewMealPlan from './pages/meal-plans/view'
import Recipes from './pages/recipes'
import EditRecipe from './pages/recipes/edit'
import ViewRecipe from './pages/recipes/view'
import ShoppingList from './pages/shopping-list'

import App from './components/app'
import Auth from './components/auth'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <Auth>
      <DndProvider backend={HTML5Backend}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<MealPlans />} />
              <Route path="recipes" element={<Recipes />} />
              <Route path="recipe/:id" element={<ViewRecipe />} />
              <Route path="recipe/edit/:id" element={<EditRecipe />} />
              <Route path="meal-plans" element={<MealPlans />} />
              <Route path="meal-plans/:id" element={<ViewMealPlan />} />
              <Route path="meal-plans/edit/:id" element={<EditMealPlan />} />
              <Route path="shopping-list" element={<ShoppingList />} />
            </Route>
            <Route path="*" element={<p>404 Page Not Found</p>} />
          </Routes>
        </HashRouter>
      </DndProvider>
    </Auth>
  </React.StrictMode>
)
