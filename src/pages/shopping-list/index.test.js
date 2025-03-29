import { updateOrder } from './index'
import { describe, expect, it } from 'vitest'

describe('ShoppingList', () => {
  describe('updateOrder()', () => {
    it('handles lists with a length of 2', () => {
      const xs = [
        { id: 'x', order: 1 },
        { id: 'y', order: 2 },
      ]

      const ys = updateOrder(1, 2, xs)

      expect(ys).toEqual([
        { id: 'y', order: 1 },
        { id: 'x', order: 2 },
      ])
    })

    it('handles move-to-first', () => {
      const xs = [
        { id: 'x', order: 1 },
        { id: 'y', order: 2 },
        { id: 'z', order: 3 },
        { id: 'a', order: 4 },
      ]

      const ys = updateOrder(2, 1, xs)

      expect(ys).toEqual([
        { id: 'y', order: 1 },
        { id: 'x', order: 2 },
        { id: 'z', order: 3 },
        { id: 'a', order: 4 },
      ])
    })

    it('handles move-to-last', () => {
      const xs = [
        { id: 'x', order: 1 },
        { id: 'y', order: 2 },
        { id: 'z', order: 3 },
        { id: 'a', order: 4 },
      ]

      const ys = updateOrder(3, 4, xs)

      expect(ys).toEqual([
        { id: 'x', order: 1 },
        { id: 'y', order: 2 },
        { id: 'a', order: 3 },
        { id: 'z', order: 4 },
      ])
    })
  })
})
