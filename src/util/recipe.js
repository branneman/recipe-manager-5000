import { compose, prop, uniqBy, sort, sortBy, ascend } from 'ramda'

export const activeSortedRecipes = compose(
  sortBy(prop('name')),
  uniqBy(prop('id'))
)

// Luxon implements DateTime#valueOf to return the epoch timestamp as int
export const activeSortedShoppingList = compose(
  sort(ascend(prop('created'))),
  uniqBy(prop('id'))
)

export function totalCalories(recipe) {
  const calories = recipe.ingredients.reduce(
    (acc, curr) => acc + (curr.calories || 0),
    0
  )

  if (Number(recipe.calories) > 0) return recipe.calories
  if (calories > 0) return calories
  return undefined
}

export function totalCarbs(recipe) {
  const carbs = recipe.ingredients.reduce(
    (acc, curr) => acc + (curr.carbs || 0),
    0
  )

  if (Number(recipe.carbs) > 0) return recipe.carbs
  if (carbs > 0) return carbs
  return undefined
}
