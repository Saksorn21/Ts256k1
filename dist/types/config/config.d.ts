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
 * Gets whether the HKDF key is compressed.
 * @function isHkdfKeyCompressed
 * @returns {boolean} - The value indicating whether the HKDF key is compressed.
 */
export declare const isHkdfKeyCompressed: () => ConfigJson["hkdfKeyCompressed"];
/**
 * Gets whether the ephemeral key is compressed.
 * @function isEphemeralKeyCompressed
 * @returns {boolean} - The value indicating whether the ephemeral key is compressed.
 */
export declare const isEphemeralKeyCompressed: () => ConfigJson["ephemeralKeyCompressed"];
export {};
//# sourceMappingURL=config.d.ts.map