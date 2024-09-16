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
    signatureOptsLowS: boolean;
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
export declare const signThrowMessage: () => ConfigJson["signThrowMessage"];
export declare const isSignatureOptsLowS: () => ConfigJson["signatureOptsLowS"];
export {};
//# sourceMappingURL=config.d.ts.map