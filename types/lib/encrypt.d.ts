/**
 * Encrypts a message using the given public key.
 *
 * @function _encrypt
 * @param {Uint8Array} key - The public key to use for encryption.
 * @param {Uint8Array} plainText - The message to encrypt.
 * @returns {Uint8Array} - The encrypted message, consisting of nonce, tag, and encrypted data concatenated together.
 */
export declare function _encrypt(key: Uint8Array, plainText: Uint8Array): Uint8Array;
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
export declare function encrypt(k1RawPK: Hex, msg: Uint8Array): Buffer;
/**
 * Creates a digital signature for the given encrypted data using the provided private key.
 * @function signMessage
 * @param {Uint8Array} encryptedData - The encrypted data to sign.
 * @param {string | Uint8Array} privateKey - The private key used for signing, provided either as a hexadecimal string or as a Uint8Array.
 * @returns {Buffer} - The generated signature in Buffer format.
 */
export declare function signMessage(encryptedData: Uint8Array, privateKey: Hex): Buffer;
/**
 * Encodes the signed message by concatenating the signature and the encrypted message.
 * @function encodeSign
 * @param {Uint8Array} cipherText - The encrypted message to be signed.
 * @param {string | Uint8Array} privateKey - The private key used to sign the message, either as a hex string or Uint8Array.
 * @returns {Uint8Array} - A Uint8Array containing both the signature and the encrypted message.
 */
export declare function encodeSign(cipherText: Uint8Array, privateKey: Hex): Buffer;
//# sourceMappingURL=encrypt.d.ts.map