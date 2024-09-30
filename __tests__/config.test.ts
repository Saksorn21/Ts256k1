import {
  TS256K1_CONFIG,
  isHkdfKeyCompressed,
  isEphemeralKeyCompressed,
  signEnabled,
  signThrowOnInvalid,
  signErrorMessage,
  signUseLowS,
} from '../src/config'
import * as fs from 'fs'
import * as path from 'path'
import { loadConfig } from '../src/config/loadConfig'
import { ConstsType } from '../src/config/consts'

describe('config/consts test', () => {
  it('ConstType ', () => {
    expect(ConstsType.SECRET_KEY_LENGTH).toBe(32)
    expect(ConstsType.COMPRESSED_PUBLIC_KEY_SIZE).toBe(33)
    expect(ConstsType.UNCOMPRESSED_PUBLIC_KEY_SIZE).toBe(65)
    expect(ConstsType.ETH_PUBLIC_KEY_SIZE).toBe(64)
    expect(ConstsType.SIGNATURE_SIZE).toBe(64)
    expect(ConstsType.XCHACHA20_NONCE_LENGTH).toBe(24)
    expect(ConstsType.AEAD_TAG_LENGTH).toBe(16)
  })
})

jest.mock('fs')
jest.mock('path')

describe('Config Class', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loadConfig', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should load configuration from file if it exists', () => {
      const mockConfig = {
        hkdfKeyCompressed: true,
        ephemeralKeyCompressed: true,
        signature: {
          enabled: false,
          throwOnInvalid: false,
          errorMessage: 'Custom error',
          useLowS: false,
        },
      }

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(path.resolve as jest.Mock).mockReturnValue('mocked/path/to/config')

      // Mock require function
      jest.mock('mocked/path/to/config', () => mockConfig, { virtual: true })

      const config = loadConfig()
      expect(config).toEqual(mockConfig)
    })

    it('should load default configuration if file does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      const config = loadConfig()
      expect(config).toEqual({
        hkdfKeyCompressed: false,
        ephemeralKeyCompressed: false,
        signature: {
          enabled: true,
          throwOnInvalid: true,
          errorMessage: 'Invalid signature',
          useLowS: true,
        },
      })
    })
  })

  describe('TS256K1_CONFIG', () => {
    it('should initialize with correct default values', () => {
      const config = TS256K1_CONFIG

      expect(config.isHkdfKeyCompressed).toBe(false)
      expect(config.isEphemeralKeyCompressed).toBe(false)
      expect(config.signEnabled).toBe(true)
      expect(config.signThrowOnInvalid).toBe(true)
      expect(config.signErrorMessage).toBe('Invalid signature')
      expect(config.signUseLowS).toBe(true)
    })

    it('should expose helper functions that return config values', () => {
      expect(isHkdfKeyCompressed()).toBe(false)
      expect(isEphemeralKeyCompressed()).toBe(false)
      expect(signEnabled()).toBe(true)
      expect(signThrowOnInvalid()).toBe(true)
      expect(signErrorMessage()).toBe('Invalid signature')
      expect(signUseLowS()).toBe(true)
    })
  })
})
