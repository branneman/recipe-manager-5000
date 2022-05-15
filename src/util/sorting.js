import {
  compose,
  prop,
  path,
  toPairs,
  uniqBy,
  sort,
  sortBy,
  ascend,
} from 'ramda'

export const activeSortedRecipes = compose(
  sortBy(prop('name')),
  uniqBy(prop('id'))
)

export const activeSortedMealPlans = compose(
  sortBy(prop('name')),
  uniqBy(prop('id'))
)

// Luxon implements DateTime#valueOf to return the epoch timestamp as int
export const activeSortedShoppingList = compose(
  sort(ascend(prop('created'))),
  uniqBy(prop('id'))
)

export const sortedMealplanDays = compose(sortBy(path(['1', 'day'])), toPairs)
