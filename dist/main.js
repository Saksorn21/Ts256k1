"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ts256k1 = void 0;
const PrivateKey_1 = require("./lib/PrivateKey");
const encrypt_1 = require("./lib/encrypt");
const decrypt_1 = require("./lib/decrypt");
/**
 * @class Ts256k1 - A class for generating and managing 256-bit secret keys, and for encrypting and decrypting messages.
 * @example
 * const k1 = new Ts256k1(privateKey, publicKey);
 * const msg = utf8ToBytes('hello');
 * k1.decrypt(k1.encrypt(msg)).toString();
 *
 * @type {import('ts256k1').Ts256k1} Ts256k1
 */
class Ts256k1 {
    /**
     * Generate a new secret key and public key pair.
     *
     * @static
     * @method getKeyPairs
     * @param {Uint8Array} [secret] - An optional secret key in Uint8Array format.
     * @returns {PrivateKey} - A new instance of PrivateKey.
     * @example
     * const k1 = Ts256k1.getKeyPairs();
     * const privateKey = k1.secretToHex();
     * const publicKey = k1.publicKey.toHex();
     * console.log(privateKey, publicKey);
     */
    static getKeyPairs(secret) {
        return new PrivateKey_1.PrivateKey(secret);
    }
    /**
     * Constructor for the Ts256k1 class.
     *
     * @param {string | Uint8Array} secret - The secret key in either hexadecimal string or Uint8Array format.
     * @param {string | Uint8Array} publicKey - The public key in either hexadecimal string or Uint8Array format.
     */
    constructor(secret, publicKey) {
        Object.defineProperty(this, "secret", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: secret
        });
        Object.defineProperty(this, "publicKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: publicKey
        });
    }
    /**
     * Encrypt a message using the public key.
     *
     * @method encrypt
     * @param {Uint8Array} msg - The message to be encrypted.
     * @returns {Uint8Array} - The encrypted message.
     */
    encrypt(msg) {
        return (0, encrypt_1.encrypt)(this.publicKey, msg);
    }
    /**
     * Decrypt a message using the secret key.
     *
     * @method decrypt
     * @param {Uint8Array} msg - The encrypted message.
     * @returns {Uint8Array} - The decrypted message.
     */
    decrypt(msg) {
        return (0, decrypt_1.decrypt)(this.secret, msg);
    }
}
exports.Ts256k1 = Ts256k1;
