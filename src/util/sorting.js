import {
  pipe,
  map,
  assoc,
  prop,
  path,
  toPairs,
  uniqBy,
  addIndex,
  sortBy,
  sortWith,
  ascend,
} from 'ramda'

export const activeSortedRecipes = pipe(
  uniqBy(prop('id')),
  sortBy(prop('name'))
)

export const activeSortedMealPlans = pipe(
  uniqBy(prop('id')),
  sortBy(prop('name'))
)

export const activeSortedShoppingList = (xs) => {
  const f = pipe(
    // 0. Uniq by id, remove duplicates
    uniqBy(prop('id')),

    // 1. Add a fake order (list.length) to items without order (sorting them last)
    // map((x) => assoc('order', xs.length, x)),
    map((x) => (Number.isInteger(x.order) ? x : assoc('order', xs.length, x))),

    // 2. Sort by order, then by created date
    // `created`: Luxon implements DateTime#valueOf to return epoch timestamp as int
    sortWith([ascend(prop('order')), ascend(prop('created'))]),

    // 3. Overwrite all orders with sequenced numbers, 1-indexed
    addIndex(map)((curr, i) => assoc('order', i + 1, curr))
  )

  return f(xs)
}

export const sortedMealplanDays = pipe(toPairs, sortBy(path(['1', 'day'])))
