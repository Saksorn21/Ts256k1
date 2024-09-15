"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEphemeralKeyCompressed = exports.isHkdfKeyCompressed = void 0;
const fs_1 = require("fs");
/**
 * Reads and parses the configuration JSON file.
 * @function loadedConfigJson
 * @returns {ConfigJson} - The configuration options loaded from the JSON file.
 */
function loadedConfigJson() {
    return JSON.parse((0, fs_1.readFileSync)('./ts256k1.config.json', 'utf-8'));
}
/**
 * @class Config
 * Represents the configuration settings for the library.
 */
class Config {
    /**
     * Initializes the Config instance by loading settings from the JSON configuration file.
     */
    constructor() {
        Object.defineProperty(this, "configJson", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * @property {boolean} isHkdfKeyCompressed - Whether the HKDF key is compressed.
         * @property {boolean} isEphemeralKeyCompressed - Whether the ephemeral key is compressed.
         */
        Object.defineProperty(this, "isHkdfKeyCompressed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isEphemeralKeyCompressed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
const isHkdfKeyCompressed = () => TS256K1_CONFIG.isHkdfKeyCompressed;
exports.isHkdfKeyCompressed = isHkdfKeyCompressed;
/**
 * Gets whether the ephemeral key is compressed.
 * @function isEphemeralKeyCompressed
 * @returns {boolean} - The value indicating whether the ephemeral key is compressed.
 */
const isEphemeralKeyCompressed = () => TS256K1_CONFIG.isEphemeralKeyCompressed;
exports.isEphemeralKeyCompressed = isEphemeralKeyCompressed;
// Create a singleton instance of Config.
const TS256K1_CONFIG = new Config();
