/**
 * @class Config
 * Represents the configuration settings for the library.
 */
declare class Config {
    /**
     * @method loader
     * @description The configuration loader.
     * @see {@link https://github.com/Saksorn21/Ts256k1?tab=readme-ov-file#configuration}
     */
    private readonly loader;
    /**
     * @property {boolean} isHkdfKeyCompressed - Whether the HKDF key is compressed.
     * @property {boolean} isEphemeralKeyCompressed - Whether the ephemeral key is compressed.
     * @property {boolean} isSignatureOptsLowS - Whether the signature options should use low S.
     */
    isHkdfKeyCompressed: Config256k1['hkdfKeyCompressed'];
    isEphemeralKeyCompressed: Config256k1['ephemeralKeyCompressed'];
    signEnabled: Config256k1['signature']['enabled'];
    signThrowOnInvalid: Config256k1['signature']['throwOnInvalid'];
    signErrorMessage: Config256k1['signature']['errorMessage'];
    signUseLowS: Config256k1['signature']['useLowS'];
    /**
     * Initializes the Config instance by loading settings from the JSON configuration file.
     */
    constructor();
}
export declare const TS256K1_CONFIG: Config;
/**
 * Gets whether the HKDF key is compressed.
 * @function isHkdfKeyCompressed
 * @returns {boolean} - The value indicating whether the HKDF key is compressed.
 */
export declare const isHkdfKeyCompressed: () => Config256k1["hkdfKeyCompressed"];
/**
 * Gets whether the ephemeral key is compressed.
 * @function isEphemeralKeyCompressed
 * @returns {boolean} - The value indicating whether the ephemeral key is compressed.
 */
export declare const isEphemeralKeyCompressed: () => Config256k1["ephemeralKeyCompressed"];
/**
 * Gets whether the signature options
 *
 */
export declare const signEnabled: () => Config256k1["signature"]["enabled"];
export declare const signThrowOnInvalid: () => Config256k1["signature"]["throwOnInvalid"];
export declare const signErrorMessage: () => Config256k1["signature"]["errorMessage"];
export declare const signUseLowS: () => Config256k1["signature"]["useLowS"];
export {};
//# sourceMappingURL=config.d.ts.map