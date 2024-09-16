

import { readFileSync } from 'fs';

/**
 * @interface ConfigJson
 * Represents the configuration options for the library.
 * @property {boolean} hkdfKeyCompressed - Indicates whether the HKDF key should be compressed.
 * @property {boolean} ephemeralKeyCompressed - Indicates whether the ephemeral key should be compressed.
 * @property {string} signThrowMessage - The message to be thrown when a signature verification fails.
 * @property {boolean} signatureOptsLowS - Indicates whether the signature options should use low S.
 */
interface ConfigJson {
  hkdfKeyCompressed: boolean;
  ephemeralKeyCompressed: boolean;
  signThrowMessage: string;
  signatureOptsLowS: boolean
}

/**
 * Reads and parses the configuration JSON file.
 * @function loadedConfigJson
 * @returns {ConfigJson} - The configuration options loaded from the JSON file.
 */
function loadedConfigJson(): ConfigJson {
  return JSON.parse(readFileSync('./ts256k1.config.json', 'utf-8'));
}

/**
 * @class Config
 * Represents the configuration settings for the library.
 */
class Config {
  private readonly configJson: ConfigJson = loadedConfigJson()

  /**
   * @property {boolean} isHkdfKeyCompressed - Whether the HKDF key is compressed.
   * @property {boolean} isEphemeralKeyCompressed - Whether the ephemeral key is compressed.
   * @property {boolean} isSignatureOptsLowS - Whether the signature options should use low S.
   */
  public readonly isHkdfKeyCompressed: ConfigJson['hkdfKeyCompressed'];
  public readonly isEphemeralKeyCompressed: ConfigJson['ephemeralKeyCompressed'];
  public readonly signThrowMessage: ConfigJson['signThrowMessage'];
  public readonly isSignatureOptsLowS: ConfigJson['signatureOptsLowS'];

  /**
   * Initializes the Config instance by loading settings from the JSON configuration file.
   */
  constructor() {
    
    this.isHkdfKeyCompressed = this.configJson.hkdfKeyCompressed;
    this.isEphemeralKeyCompressed = this.configJson.ephemeralKeyCompressed;
    this.signThrowMessage = this.configJson.signThrowMessage;
    this.isSignatureOptsLowS = this.configJson.signatureOptsLowS;
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

export const signThrowMessage = (): ConfigJson['signThrowMessage'] => TS256K1_CONFIG.signThrowMessage;
export const isSignatureOptsLowS = (): ConfigJson['signatureOptsLowS'] => TS256K1_CONFIG.isSignatureOptsLowS

