
import { loadConfig } from './loadConfig'


/**
 * @class Config
 * Represents the configuration settings for the library.
 */
class Config {
  private readonly loader: Config256k1 = loadConfig()

  /**
   * @property {boolean} isHkdfKeyCompressed - Whether the HKDF key is compressed.
   * @property {boolean} isEphemeralKeyCompressed - Whether the ephemeral key is compressed.
   * @property {boolean} isSignatureOptsLowS - Whether the signature options should use low S.
   */
  public readonly isHkdfKeyCompressed: Config256k1['hkdfKeyCompressed'];
  public readonly isEphemeralKeyCompressed: Config256k1['ephemeralKeyCompressed'];
  public readonly signEnabled: Config256k1['signature']['enabled']
  public readonly signThrowOnInvalid: Config256k1['signature']['throwOnInvalid']
  public readonly signErrorMessage: Config256k1['signature']['errorMessage']
  public readonly signUseLowS: Config256k1['signature']['useLowS']

  /**
   * Initializes the Config instance by loading settings from the JSON configuration file.
   */
  constructor() {
    
    this.isHkdfKeyCompressed = this.loader.hkdfKeyCompressed;
    this.isEphemeralKeyCompressed = this.loader.ephemeralKeyCompressed;
    this.signErrorMessage = this.loader.signature.errorMessage;
    this.signEnabled = this.loader.signature.enabled
    this.signThrowOnInvalid = this.loader.signature.throwOnInvalid
    this.signUseLowS = this.loader.signature.useLowS
  }
}

// Create a singleton instance of Config.
const TS256K1_CONFIG: Config = new Config();

/**
 * Gets whether the HKDF key is compressed.
 * @function isHkdfKeyCompressed
 * @returns {boolean} - The value indicating whether the HKDF key is compressed.
 */
export const isHkdfKeyCompressed = (): ConfigJson['hkdfKeyCompressed'] => TS256K1_CONFIG.isHkdfKeyCompressed;

/**
 * Gets whether the ephemeral key is compressed.
 * @function isEphemeralKeyCompressed
 * @returns {boolean} - The value indicating whether the ephemeral key is compressed.
 */
export const isEphemeralKeyCompressed = (): ConfigJson['ephemeralKeyCompressed'] => TS256K1_CONFIG.isEphemeralKeyCompressed;

/**
 * Gets whether the signature options
 * 
 */
export const signEnabled = (): Config256k1['signature']['enabled'] => TS256K1_CONFIG.signEnabled
export const signThrowOnInvalid = (): Config256k1['signature']['throwOnInvalid'] => TS256K1_CONFIG.signThrowOnInvalid
export const signErrorMessage = (): Config256k1['signature']['errorMessage'] => TS256K1_CONFIG.signErrorMessage
export const signUseLowS = (): Config256k1['signature']['useLowS'] => TS256K1_CONFIG.signUseLowS

