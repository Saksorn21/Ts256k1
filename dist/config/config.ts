

import { readFileSync } from 'fs';

/**
 * @interface ConfigJson
 * Represents the configuration options for the library.
 * @property {boolean} hkdfKeyCompressed - Indicates whether the HKDF key should be compressed.
 * @property {boolean} ephemeralKeyCompressed - Indicates whether the ephemeral key should be compressed.
 */
interface ConfigJson {
  hkdfKeyCompressed: boolean;
  ephemeralKeyCompressed: boolean;
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
  private readonly configJson: ConfigJson;

  /**
   * @property {boolean} isHkdfKeyCompressed - Whether the HKDF key is compressed.
   * @property {boolean} isEphemeralKeyCompressed - Whether the ephemeral key is compressed.
   */
  public readonly isHkdfKeyCompressed: ConfigJson['hkdfKeyCompressed'];
  public readonly isEphemeralKeyCompressed: ConfigJson['ephemeralKeyCompressed'];

  /**
   * Initializes the Config instance by loading settings from the JSON configuration file.
   */
  constructor() {
    this.configJson = loadedConfigJson();
    this.isHkdfKeyCompressed = this.configJson.hkdfKeyCompressed;
    this.isEphemeralKeyCompressed = this.configJson.ephemeralKeyCompressed;
  }
}

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

// Create a singleton instance of Config.
const TS256K1_CONFIG: Config = new Config();