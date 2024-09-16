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
 * Encodes the signed message by concatenating the signature and the encrypted message.
 * @function encodeSign
 * @param {Uint8Array} encryptedMessage - The encrypted message to be signed.
 * @param {string | Uint8Array} privateKey - The private key used to sign the message, either as a hex string or Uint8Array.
 * @returns {Buffer} - A Buffer containing both the signature and the encrypted message.
 */
export declare function encodeSign(encryptedMessage: Uint8Array, privateKey: Hex): Buffer;
//# sourceMappingURL=encrypt.d.ts.map