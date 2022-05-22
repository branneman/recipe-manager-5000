import { activeSortedShoppingList } from './sorting'

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
})
