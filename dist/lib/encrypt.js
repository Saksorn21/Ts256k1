"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
const utils_1 = require("../utils");
const config_1 = require("../config");
const PrivateKey_1 = require("./PrivateKey");
const PublicKey_1 = require("./PublicKey");
/**
 * Encrypts a message using the given public key.
 *
 * @function _encrypt
 * @param {Uint8Array} key - The public key to use for encryption.
 * @param {Uint8Array} plainText - The message to encrypt.
 * @returns {Uint8Array} - The encrypted message, consisting of nonce, tag, and encrypted data concatenated together.
 */
function _encrypt(key, plainText) {
    // TODO: xchacha20poly1305 nonce 24 bytes
    const nonce = (0, utils_1.randomBytes)(config_1.XCHACHA20_NONCE_LENGTH);
    const cipher = (0, utils_1.xchacha20)(key, nonce);
    const ciphered = cipher.encrypt(plainText);
    const encrypted = ciphered.subarray(0, ciphered.length - config_1.AEAD_TAG_LENGTH);
    const tag = ciphered.subarray(ciphered.length - config_1.AEAD_TAG_LENGTH);
    return (0, utils_1.concatBytes)(nonce, tag, encrypted);
}
/**
 * Encrypts a message using the given public key.
 *
 * This function manages the conversion of the public key from its raw form (hexadecimal string or Uint8Array)
 * into a `PublicKey` instance. It then uses an ephemeral private key to encapsulate the public key and generate
 * a shared secret key. The message is encrypted with this shared secret key using XChaCha20-Poly1305 encryption.
 *
 * @function encrypt
 * @param {string | Uint8Array} k1RawPK - The public key to use for encryption, provided either as a hexadecimal string or as a Uint8Array.
 * @param {Uint8Array} msg - The message to encrypt.
 * @returns {Buffer} - The encrypted message, which includes the public key (compressed or uncompressed) and the encrypted data concatenated together.
 *
 * @example
 * const publicKey = 'your-public-key-in-hex'; // Or Uint8Array
 * const message = utf8ToBytes('hello');
 * const encryptedMessage = encrypt(publicKey, message);
 * console.log(encryptedMessage.toString('hex'));
 */
function encrypt(k1RawPK, msg) {
    const temporaryStorageKey = new PrivateKey_1.PrivateKey();
    const receiverPK = k1RawPK instanceof Uint8Array
        ? new PublicKey_1.PublicKey(k1RawPK)
        : PublicKey_1.PublicKey.fromHex(k1RawPK);
    const xKey = temporaryStorageKey.encapsulate(receiverPK);
    const encrypted = _encrypt(xKey, msg);
    let pk;
    if ((0, config_1.isEphemeralKeyCompressed)()) {
        pk = temporaryStorageKey.publicKey.compressed;
    }
    else {
        pk = temporaryStorageKey.publicKey.uncompressed;
    }
    // Convert the final result to a Buffer
    return Buffer.from((0, utils_1.concatBytes)(pk, encrypted));
}
