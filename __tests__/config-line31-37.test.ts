import { Config } from '../src/config'
import { loadConfig } from '../src/config/loadConfig'

// Mock loadConfig function globally for the entire test file
jest.mock('../src/config/loadConfig')

describe('Config Class line 31-37', () => {
   beforeEach(() => {
    jest.clearAllMocks()
   })

  it('should initialize with default values when loader has missing values', () => {
    // Mock the loadConfig function to return a partial config
    (loadConfig as jest.Mock).mockReturnValue({
      hkdfKeyCompressed: true, // Only some values are provided
      signature: {
        enabled: false,
      },
    })
   
    const configk1 = new Config()

    expect(configk1.isHkdfKeyCompressed).toBe(true) // Should use mock value
    expect(configk1.isEphemeralKeyCompressed).toBe(false) // Should use default
    expect(configk1.signEnabled).toBe(false) // Should use mock value
    expect(configk1.signThrowOnInvalid).toBe(true) // Should use default
    expect(configk1.signErrorMessage).toBe('Invalid signature') // Should use default
    expect(configk1.signUseLowS).toBe(true) // Should use default
  })
})