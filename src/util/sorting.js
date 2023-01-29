import { DateTime } from 'luxon'
import {
  addIndex,
  ascend,
  assoc,
  filter,
  find,
  map,
  path,
  pipe,
  prop,
  propEq,
  sortBy,
  sortWith,
  toPairs,
  uniqBy,
  values,
} from 'ramda'

export const activeSortedRecipes = pipe(
  uniqBy(prop('id')),
  sortBy(prop('name'))
)

export const findRecipe = (id, recipes) => find(propEq('id', id), recipes)

export const getCurrentMealPlans = (now) =>
  filter((mealplan) => isCurrentMealPlan(mealplan, now))

/**
 * @param {Object<{ days: Object }>} mealplan
 * @param {Luxon} now
 * @returns {Boolean}
 */
export function isCurrentMealPlan(mealplan, now) {
  const days = values(mealplan.days).length
  if (days < 1) return false

  const from = DateTime.fromISO(mealplan.start)
  const to = from.plus({ days })

  return Number(now) >= Number(from) && Number(now) <= Number(to)
}

export const currentMealplanDay = (mealplan, now) => {
  const day2iso = (day) =>
    DateTime.fromISO(mealplan.start).plus({ days: day.day }).toISODate()
  const addDateProp = (day) => assoc('date', day2iso(day), day)

  const f = pipe(
    prop('days'),
    sortedMealplanDays,
    map(prop('1')),
    map(addDateProp),
    find(propEq('date', now.toISODate()))
  )
  return f(mealplan)
}

export const activeSortedMealPlans = (now) =>
  pipe(
    filter((x) => !isCurrentMealPlan(x, now)),
    uniqBy(prop('id')),
    sortBy(prop('name'))
  )

export const sortedMealplanDays = pipe(toPairs, sortBy(path(['1', 'day'])))

export const activeSortedShoppingList = (xs) => {
  const f = pipe(
    // 0. Uniq by id, delete duplicates
    uniqBy(prop('id')),

    // 1. Add a fake order (list.length) to items without order (sorting them last)
    map((x) => (Number.isInteger(x.order) ? x : assoc('order', xs.length, x))),

    // 2. Sort by order, then by created date
    // `created`: Luxon implements DateTime#valueOf to return epoch timestamp as int
    sortWith([ascend(prop('order')), ascend(prop('created'))]),

    // 3. Overwrite all orders with sequenced numbers, 1-indexed
    addIndex(map)((curr, i) => assoc('order', i + 1, curr))
  )

  return f(xs)
}

export const search = (recipes, q) => {
  if (q.length <= 2) return []

  const isMatch = (recipe) => {
    if (recipe.name && recipe.name.toLowerCase().includes(q.toLowerCase()))
      return true
    if (recipe.tags && recipe.tags.includes(q)) return true
    return false
  }

  return filter(isMatch, recipes)
}
