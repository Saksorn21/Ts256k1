"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKey = void 0;
const PublicKey_1 = require("./PublicKey");
const config_1 = require("../config");
const utils_1 = require("../utils");
const { getPublicKey, getSharedSecret, utils } = utils_1.K1;
/**
 * @class PrivateKey - A class that represents a private key.
 */
class PrivateKey {
    /**
     * Generates a new private key from a hexadecimal string.
     *
     * @static
     * @method fromHex
     * @param {string} hex - The hexadecimal string representing the private key.
     * @returns {PrivateKey} - A new instance of PrivateKey.
     */
    static fromHex(hex) {
        return new PrivateKey((0, utils_1.decodeHex)(hex));
    }
    /**
     * Retrieves the secret key as a Uint8Array.
     *
     * @property {Uint8Array} secret - The secret key in byte array format.
     * @returns {Uint8Array} - The secret key as a byte array (Uint8Array).
     */
    get secret() {
        return Buffer.from(this.data);
    }
    /**
     * Converts the secret key to a hexadecimal string.
     *
     * @property {string} secretToHex - The secret key in hexadecimal format.
     * @returns {string} - The hexadecimal representation of the secret key.
     */
    get secretToHex() {
        return (0, utils_1.bytesToHex)(this.data);
    }
    /**
     * Constructor for the PrivateKey class.
     *
     * @constructor
     * @param {Uint8Array} [secret] - Optional secret key in Uint8Array format. If not provided, a valid secret will be generated.
     * @throws {Error} If the secret key is invalid.
     */
    constructor(secret) {
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The public key derived from the private key.
         *
         * @property {PublicKey} publicKey - The public key that corresponds to this private key.
         */
        Object.defineProperty(this, "publicKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const sk = secret ? secret : this.getValidSecret();
        if (!this.validateSecret(sk))
            throw new Error('Invalid private key');
        this.data = sk;
        this.publicKey = new PublicKey_1.PublicKey(this.getPublicKey(sk));
    }
    /**
     * Encapsulates the private key with the given public key to derive a shared secret.
     *
     * @method encapsulate
     * @param {PublicKey} pk - The public key to use for encapsulation.
     * @returns {Uint8Array} - The derived shared secret.
     */
    encapsulate(pk) {
        let senderPoint;
        let sharedPoint;
        if ((0, config_1.isHkdfKeyCompressed)()) {
            senderPoint = this.publicKey.compressed;
            sharedPoint = this.multiply(pk, true);
        }
        else {
            senderPoint = this.publicKey.uncompressed;
            sharedPoint = this.multiply(pk, false);
        }
        return (0, utils_1.getSharedKey)(senderPoint, sharedPoint);
    }
    /**
     * Multiplies the private key with the given public key to derive a shared point.
     *
     * @method multiply
     * @param {PublicKey} pk - The public key to multiply with.
     * @param {boolean} [compressed=false] - Whether the public key is in compressed format.
     * @returns {Uint8Array} - The derived shared point.
     */
    multiply(pk, compressed = false) {
        //TODO: .slice(1) - remove 0x
        return getSharedSecret(this.data, pk.compressed, compressed).slice(1);
    }
    /**
     * Validates whether the given secret key is valid.
     *
     * @method validateSecret
     * @param {Uint8Array} secret - The secret key to validate.
     * @returns {boolean} - True if the secret key is valid, otherwise false.
     */
    validateSecret(secret) {
        return utils.isValidPrivateKey(secret);
    }
    /**
     * Generates a valid secret key.
     *
     * @method getValidSecret
     * @returns {Uint8Array} - A valid secret key.
     */
    getValidSecret() {
        let secret;
        do {
            secret = (0, utils_1.randomBytes)(config_1.ConstsType.SECRET_KEY_LENGTH);
        } while (!this.validateSecret(secret));
        return secret;
    }
    /**
     * Derives the public key associated with the given private key.
     *
     * @method getPublicKey
     * @param {Uint8Array} secret - The private key to derive the public key from.
     * @returns {Uint8Array} - The corresponding public key.
     */
    getPublicKey(secret) {
        return getPublicKey(secret);
    }
}
exports.PrivateKey = PrivateKey;
