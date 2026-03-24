import { describe, it, expect } from 'vitest'
import { parseTags } from './tags'

describe('parseTags', () => {
  it('normalizes tags, strips stop words, and deduplicates', () => {
    const result = parseTags('Work and FUN #work ve ile')
    expect(result.ok).toBe(true)
    expect(result.tags).toEqual(['#work', '#fun'])
  })

  it('returns an error when only stop words are provided', () => {
    const result = parseTags('and ve ile')
    expect(result.ok).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
