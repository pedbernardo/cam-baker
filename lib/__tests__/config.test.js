import { describe, expect, it } from 'vitest'
import { defineConfig } from '../config.mjs'

describe('defineConfig', () => {
  /**
   * It's only used for exposes intellisense autocompletion
   */
  it('should return config without any changes', () => {
    const rawConfig = { anyKey: 'anyValue' }
    const config = defineConfig(rawConfig)

    expect(config).toStrictEqual(rawConfig)
  })
})
