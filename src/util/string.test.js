import { splitUrls } from './string'
import { describe, expect, it } from 'vitest'

describe('splitUrls', () => {
  it('should handle text with no URLs', () => {
    const text = 'This is a plain text without any URLs'
    const result = splitUrls(text)
    expect(result).toEqual([{ text, isUrl: false }])
  })

  it('should handle text with a single URL at the end', () => {
    const text = 'Check out this link: https://example.com'
    const result = splitUrls(text)
    expect(result).toEqual([
      { text: 'Check out this link: ', isUrl: false },
      { text: 'https://example.com', isUrl: true },
    ])
  })

  it('should handle text with a single URL at the start', () => {
    const text = 'https://example.com is a great website'
    const result = splitUrls(text)
    expect(result).toEqual([
      { text: 'https://example.com', isUrl: true },
      { text: ' is a great website', isUrl: false },
    ])
  })

  it('should handle text with multiple URLs', () => {
    const text = 'Visit https://example.com and https://test.com for more info'
    const result = splitUrls(text)
    expect(result).toEqual([
      { text: 'Visit ', isUrl: false },
      { text: 'https://example.com', isUrl: true },
      { text: ' and ', isUrl: false },
      { text: 'https://test.com', isUrl: true },
      { text: ' for more info', isUrl: false },
    ])
  })

  it('should handle URLs with query parameters', () => {
    const text = 'Check https://example.com?param=value&other=123'
    const result = splitUrls(text)
    expect(result).toEqual([
      { text: 'Check ', isUrl: false },
      { text: 'https://example.com?param=value&other=123', isUrl: true },
    ])
  })

  it('should handle URLs with different protocols', () => {
    const text = 'Both http://example.com and https://secure.com work'
    const result = splitUrls(text)
    expect(result).toEqual([
      { text: 'Both ', isUrl: false },
      { text: 'http://example.com', isUrl: true },
      { text: ' and ', isUrl: false },
      { text: 'https://secure.com', isUrl: true },
      { text: ' work', isUrl: false },
    ])
  })

  it('should handle empty text', () => {
    const text = ''
    const result = splitUrls(text)
    expect(result).toEqual([{ text: '', isUrl: false }])
  })
})
