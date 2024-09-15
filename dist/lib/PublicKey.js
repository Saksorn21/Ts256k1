"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = void 0;
const utils_1 = require("../utils");
const config_1 = require("../config");
/**
 * @class PublicKey - A class that represents a public key.
 */
class PublicKey {
    /**
     * Create a new instance of PublicKey from a hexadecimal string.
     *
     * @static
     * @method fromHex
     * @param {string} hex - The hexadecimal string representing the public key.
     * @returns {PublicKey} - A new instance of PublicKey.
     */
    static fromHex(hex) {
        return new PublicKey((0, utils_1.hexToPublicKey)(hex));
    }
    /**
     * @property {Uint8Array} compressed - The compressed public key.
     * @property {Uint8Array} uncompressed - The uncompressed public key.
     */
    get compressed() {
        // Return compressed public key as Uint8Array
        return Buffer.from(this.data);
    }
    get uncompressed() {
        // Return uncompressed public key as Uint8Array
        return Buffer.from(this.convertPublicKeyFormat(this.data, false));
    }
    /**
     * @constructor
     * @param {Uint8Array} data - The public key data in Uint8Array format.
     */
    constructor(data) {
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = this.convertPublicKeyFormat(data, true);
    }
    /**
     * Converts the public key to a hexadecimal string.
     *
     * @method toHex
     * @param {boolean} [compressed=true] - Whether to return the compressed or uncompressed public key.
     * @returns {string} - The hexadecimal representation of the public key.
     */
    toHex(compressed = true) {
        if (compressed) {
            return (0, utils_1.bytesToHex)(this.data);
        }
        else {
            return (0, utils_1.bytesToHex)(this.uncompressed);
        }
    }
    /**
     * Derives a shared secret using the private key and the current public key.
     *
     * @method decapsulate
     * @param {PrivateKey} sk - The private key used to decapsulate (derive shared secret).
     * @returns {Uint8Array} - The derived shared secret in byte array format.
     */
    decapsulate(sk) {
        let senderPoint;
        let sharedPoint;
        if ((0, config_1.isHkdfKeyCompressed)()) {
            senderPoint = this.data;
            sharedPoint = sk.multiply(this, true);
        }
        else {
            senderPoint = this.uncompressed;
            sharedPoint = sk.multiply(this, false);
        }
        return (0, utils_1.getSharedKey)(senderPoint, sharedPoint);
    }
    /**
     * Converts the public key to the specified format (compressed or uncompressed).
     *
     * @method convertPublicKeyFormat
     * @param {Uint8Array} pk - The public key to be converted.
     * @param {boolean} compressed - Whether to convert to the compressed format.
     * @returns {Uint8Array} - The converted public key.
     * @private
     */
    convertPublicKeyFormat(pk, compressed) {
        return utils_1.K1.getSharedSecret(BigInt(1), pk, compressed);
    }
}
exports.PublicKey = PublicKey;
