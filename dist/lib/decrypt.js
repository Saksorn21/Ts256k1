"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = decrypt;
const utils_1 = require("../utils");
const config_1 = require("../config");
const PrivateKey_1 = require("./PrivateKey");
const PublicKey_1 = require("./PublicKey");
/**
 * Decrypts a message using the given private key.
 *
 * This function handles decryption by extracting the nonce, tag, and encrypted part from the cipher text.
 * It then uses the private key and XChaCha20 decryption to return the original plain text message.
 *
 * @function _decrypt
 * @param {Uint8Array} key - The private key to use for decryption.
 * @param {Uint8Array} cipherText - The message to decrypt, which includes nonce, tag, and encrypted data.
 * @returns {Uint8Array} - The decrypted message.
 */
function _decrypt(key, cipherText) {
    const nonceTagLength = config_1.XCHACHA20_NONCE_LENGTH + config_1.AEAD_TAG_LENGTH;
    const nonce = cipherText.subarray(0, config_1.XCHACHA20_NONCE_LENGTH);
    const tag = cipherText.subarray(config_1.XCHACHA20_NONCE_LENGTH, nonceTagLength);
    const encrypted = cipherText.subarray(nonceTagLength);
    const decipher = (0, utils_1.xchacha20)(key, Uint8Array.from(nonce)); // to reset byteOffset
    const ciphered = (0, utils_1.concatBytes)(encrypted, tag);
    return decipher.decrypt(ciphered);
}
/**
 * Decrypts a message using the given private key.
 *
 * This function manages the conversion of the private key from its raw form (hexadecimal string or Uint8Array)
 * into a `PrivateKey` instance. It then extracts the public key from the message, decapsulates it to generate
 * the shared secret key, and decrypts the message using XChaCha20-Poly1305 decryption.
 *
 * @function decrypt
 * @param {string | Uint8Array} k1RawSK - The private key to use for decryption, provided either as a hexadecimal string or as a Uint8Array.
 * @param {Uint8Array} msg - The message to decrypt, which includes the public key and encrypted data.
 * @returns {Buffer} - The decrypted message.
 *
 * @example
 * const privateKey = 'your-private-key-in-hex'; // Or Uint8Array
 * const encryptedMessage = Buffer.from('encrypted-data');
 * const decryptedMessage = decrypt(privateKey, encryptedMessage);
 * console.log(decryptedMessage.toString('utf8'));
 */
function decrypt(k1RawSK, msg) {
    const temporaryStorageKey = k1RawSK instanceof Uint8Array
        ? new PrivateKey_1.PrivateKey(k1RawSK)
        : PrivateKey_1.PrivateKey.fromHex(k1RawSK);
    const keySize = isCompressed();
    const senderPK = new PublicKey_1.PublicKey(msg.subarray(0, keySize));
    const encrypted = msg.subarray(keySize);
    const symKey = senderPK.decapsulate(temporaryStorageKey);
    return Buffer.from(_decrypt(symKey, encrypted));
}
/**
 * Determines the size of the public key based on whether it is compressed or not.
 *
 * This function checks if ephemeral key compression is enabled by calling `isEphemeralKeyCompressed`.
 * It then returns the size of the public key in bytes: either the compressed or uncompressed size.
 *
 * @function isCompressed
 * @returns {number} - The size of the public key in bytes. Returns `COMPRESSED_PUBLIC_KEY_SIZE` if the key is compressed,
 *                     otherwise returns `UNCOMPRESSED_PUBLIC_KEY_SIZE`.
 */
function isCompressed() {
    return (0, config_1.isEphemeralKeyCompressed)() ?
        config_1.COMPRESSED_PUBLIC_KEY_SIZE : config_1.UNCOMPRESSED_PUBLIC_KEY_SIZE;
}
