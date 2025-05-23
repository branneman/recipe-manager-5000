import { activeSortedShoppingList, isCurrentMealPlan, search } from './sorting'
import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'

describe('activeSortedShoppingList()', () => {
  it('returns a list of unique items, by id', () => {
    const xs = [
      { id: 'x', order: 1 },
      { id: 'y', order: 2 },
      { id: 'z', order: 3 },
      { id: 'z', order: 3 },
      { id: 'a', order: 4 },
    ]

    const ys = activeSortedShoppingList(xs)

    expect(ys).toEqual([
      { id: 'x', order: 1 },
      { id: 'y', order: 2 },
      { id: 'z', order: 3 },
      { id: 'a', order: 4 },
    ])
  })

  it('orders by order', () => {
    const xs = [
      { id: 'y', order: 2 },
      { id: 'x', order: 1 },
      { id: 'a', order: 4 },
      { id: 'z', order: 3 },
    ]

    const ys = activeSortedShoppingList(xs)

    expect(ys).toEqual([
      { id: 'x', order: 1 },
      { id: 'y', order: 2 },
      { id: 'z', order: 3 },
      { id: 'a', order: 4 },
    ])
  })

  it('adds an order if it doesnt exist yet', () => {
    const xs = [
      { id: 'x', order: 1, created: 0 },
      { id: 'y', created: 4 },
      { id: 'z', order: 3, created: 0 },
      { id: 'a', order: 4, created: 0 },
    ]

    const ys = activeSortedShoppingList(xs)

    expect(ys).toEqual([
      { id: 'x', order: 1, created: 0 },
      { id: 'z', order: 2, created: 0 },
      { id: 'a', order: 3, created: 0 },
      { id: 'y', order: 4, created: 4 },
    ])
  })

  it('first sorts by created date, then adds missing order', () => {
    const xs = [
      { id: 'x', created: 4 },
      { id: 'y', order: 1, created: 2 },
      { id: 'z', order: 2, created: 3 },
      { id: 'a', created: 1 },
    ]

    const ys = activeSortedShoppingList(xs)

    expect(ys).toEqual([
      { id: 'y', order: 1, created: 2 },
      { id: 'z', order: 2, created: 3 },
      { id: 'a', order: 3, created: 1 },
      { id: 'x', order: 4, created: 4 },
    ])
  })

  it('first sorts by created date, then adds orders', () => {
    const xs = [
      { id: 'x', created: 4 },
      { id: 'y', created: 2 },
      { id: 'z', created: 3 },
      { id: 'a', created: 1 },
    ]

    const ys = activeSortedShoppingList(xs)

    expect(ys).toEqual([
      { id: 'a', order: 1, created: 1 },
      { id: 'y', order: 2, created: 2 },
      { id: 'z', order: 3, created: 3 },
      { id: 'x', order: 4, created: 4 },
    ])
  })

  it('ignores undefined identifiers', () => {
    const xs = [
      { id: undefined, order: 1 },
      { id: 'y', order: 2 },
      { id: 'z', order: 3 },
      { id: 'a', order: 4 },
    ]

    const ys = activeSortedShoppingList(xs)

    expect(ys).toEqual([
      { id: 'y', order: 1 },
      { id: 'z', order: 2 },
      { id: 'a', order: 3 },
    ])
  })
})

describe('isCurrentMealPlan()', () => {
  it('returns true if now is between mealplan-start and end', () => {
    const mealplan = {
      start: '2022-06-01T00:00:00.000Z',
      days: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} },
    }
    const now = DateTime.fromISO('2022-06-03T00:00:00.000Z')

    const result = isCurrentMealPlan(mealplan, now)

    expect(result).toEqual(true)
  })

  it('returns false if now is before mealplan-start and end', () => {
    const mealplan = {
      start: '2022-06-01T00:00:00.000Z',
      days: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} },
    }
    const now = DateTime.fromISO('2022-05-30T00:00:00.000Z')

    const result = isCurrentMealPlan(mealplan, now)

    expect(result).toEqual(false)
  })

  it('returns false if now is after mealplan-start and end', () => {
    const mealplan = {
      start: '2022-06-01T00:00:00.000Z',
      days: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} },
    }
    const now = DateTime.fromISO('2022-06-10T00:00:00.000Z')

    const result = isCurrentMealPlan(mealplan, now)

    expect(result).toEqual(false)
  })

  it('returns true if mealplan is on its last day', () => {
    const mealplan = {
      start: '2022-06-01T00:00:00.000Z',
      days: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} },
    }
    const now = DateTime.fromISO('2022-06-05T23:59:59.999Z')

    const result = isCurrentMealPlan(mealplan, now)

    expect(result).toEqual(true)
  })

  it('returns false if mealplan has no days', () => {
    const mealplan = {
      start: '2022-06-01T00:00:00.000Z',
      days: {},
    }
    const now = DateTime.fromISO('2022-06-01T00:00:00.000Z')

    const result = isCurrentMealPlan(mealplan, now)

    expect(result).toEqual(false)
  })
})

describe('search', () => {
  it('filters a list on name', () => {
    const xs = [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }]
    const ys = search(xs, 'bar')
    expect(ys).toEqual([{ name: 'bar' }])
  })

  it('does partial matching on `name`', () => {
    const xs = [
      { name: 'foo zab' },
      { name: 'foo bar baz' },
      { name: ' foo baz' },
    ]
    const ys = search(xs, 'bar')
    expect(ys).toEqual([{ name: 'foo bar baz' }])
  })

  it('does partial matching on `tags`', () => {
    const xs = [
      { name: 'foo zab', tags: 'food' },
      { name: 'foo bar baz', tags: 'nice-food' },
      { name: ' foo baz', tags: 'dinner pasta' },
    ]
    const ys = search(xs, 'dinner')
    expect(ys).toEqual([{ name: ' foo baz', tags: 'dinner pasta' }])
  })

  it('does case-insensitive matching on `name`', () => {
    const xs = [{ name: 'Foo' }, { name: 'bAR baz' }, { name: 'foo baz' }]
    const ys = search(xs, 'bar')
    expect(ys).toEqual([{ name: 'bAR baz' }])
  })

  it('does diacritics-insensitive matching on `name`', () => {
    const xs = [{ name: 'Bánh mì' }, { name: 'Phở bò' }, { name: 'Bún chả' }]
    const ys = search(xs, 'pho')
    expect(ys).toEqual([{ name: 'Phở bò' }])
  })
})
