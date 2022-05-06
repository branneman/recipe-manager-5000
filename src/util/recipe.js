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
