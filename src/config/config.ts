import { loadConfig } from './loadConfig'

/**
 * @class Config
 * Represents the configuration settings for the library.
 */
export class Config {
  /**
   * @method loader
   * @description The configuration loader.
   * @see {@link https://github.com/Saksorn21/Ts256k1?tab=readme-ov-file#configuration}
   */
  private readonly loader: Config256k1 = loadConfig()

  /**
   * @property {boolean} isHkdfKeyCompressed - Whether the HKDF key is compressed.
   * @property {boolean} isEphemeralKeyCompressed - Whether the ephemeral key is compressed.
   * @property {boolean} isSignatureOptsLowS - Whether the signature options should use low S.
   */
  public isHkdfKeyCompressed: Config256k1['hkdfKeyCompressed']
  public isEphemeralKeyCompressed: Config256k1['ephemeralKeyCompressed']
  public signEnabled: Config256k1['signature']['enabled']
  public signThrowOnInvalid: Config256k1['signature']['throwOnInvalid']
  public signErrorMessage: Config256k1['signature']['errorMessage']
  public signUseLowS: Config256k1['signature']['useLowS']

  /**
   * Initializes the Config instance by loading settings from the JSON configuration file.
   */
  constructor() {
    this.isHkdfKeyCompressed = this.loader?.hkdfKeyCompressed ?? false
    this.isEphemeralKeyCompressed = this.loader?.ephemeralKeyCompressed ?? false
    this.signErrorMessage =
      this.loader?.signature?.errorMessage ?? 'Invalid signature'
    this.signEnabled = this.loader?.signature?.enabled ?? true
    this.signThrowOnInvalid = this.loader?.signature?.throwOnInvalid ?? true
    this.signUseLowS = this.loader?.signature?.useLowS ?? true
  }
}

// Create a singleton instance of Config.
export const TS256K1_CONFIG: Config = new Config()

/**
 * Gets whether the HKDF key is compressed.
 * @function isHkdfKeyCompressed
 * @returns {boolean} - The value indicating whether the HKDF key is compressed.
 */
export const isHkdfKeyCompressed = (): Config256k1['hkdfKeyCompressed'] =>
  TS256K1_CONFIG.isHkdfKeyCompressed

/**
 * Gets whether the ephemeral key is compressed.
 * @function isEphemeralKeyCompressed
 * @returns {boolean} - The value indicating whether the ephemeral key is compressed.
 */
export const isEphemeralKeyCompressed =
  (): Config256k1['ephemeralKeyCompressed'] =>
    TS256K1_CONFIG.isEphemeralKeyCompressed

/**
 * Gets whether the signature options
 *
 */
export const signEnabled = (): Config256k1['signature']['enabled'] =>
  TS256K1_CONFIG.signEnabled

export const signThrowOnInvalid =
  (): Config256k1['signature']['throwOnInvalid'] =>
    TS256K1_CONFIG.signThrowOnInvalid
export const signErrorMessage = (): Config256k1['signature']['errorMessage'] =>
  TS256K1_CONFIG.signErrorMessage
export const signUseLowS = (): Config256k1['signature']['useLowS'] =>
  TS256K1_CONFIG.signUseLowS
