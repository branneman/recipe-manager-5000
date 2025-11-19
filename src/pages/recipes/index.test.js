import { allTags } from './index'
import { describe, expect, it } from 'vitest'

describe('Recipes', () => {
  describe('allTags()', () => {
    it('filters undefined tags', () => {
      const recipes = [
        { tags: ['aa bb'] },
        { tags: undefined },
        { tags: ['bb'] },
        { tags: ['aa'] },
        { tags: [undefined] },
      ]
      const ys = allTags(recipes)
      expect(ys).toEqual(['aa', 'aa bb', 'bb'])
    })

    it('filters empty string tags', () => {
      const recipes = [
        { tags: ['aa bb'] },
        { tags: ['bb', ''] },
        { tags: ['aa'] },
      ]
      const ys = allTags(recipes)
      expect(ys).toEqual(['aa', 'aa bb', 'bb'])
    })

    it('trims tags', () => {
      const recipes = [{ tags: ['aa bb'] }, { tags: [' bb', 'aa '] }]
      const ys = allTags(recipes)
      expect(ys).toEqual(['aa', 'aa bb', 'bb'])
    })

    it('deletes duplicate tags', () => {
      const recipes = [{ tags: ['a', 'b', 'c'] }, { tags: ['b', 'c', 'd'] }]
      const ys = allTags(recipes)
      expect(ys).toEqual(['a', 'b', 'c', 'd'])
    })

    it('sorts tags', () => {
      const recipes = [{ tags: ['d', 'b', 'c'] }, { tags: ['b', 'c', 'a'] }]
      const ys = allTags(recipes)
      expect(ys).toEqual(['a', 'b', 'c', 'd'])
    })
  })
})
