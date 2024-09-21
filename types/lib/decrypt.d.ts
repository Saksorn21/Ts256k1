/**
 * @interface DecodedSignMessage
 * @property {Uint8Array} signBytes - The signature of the message.
 * @property {Uint8Array} encryptMessage - The encrypted message.
 */
export declare interface DecodeSignMessage {
    signBytes: Uint8Array;
    encryptMessage: Uint8Array;
}
/**
 * @interface  VerifyMessage
 * @property {boolean} verify - The signature of the message.
 * @property {Uint8Array} cipherText - The encrypted message.
 */
export declare interface VerifyMessage {
    verify: boolean;
    cipherText: Uint8Array;
}
/**
 * Helper function to extract nonce, tag, and encrypted data.
 * @function extractParts
 * @param {Uint8Array} cipherText - The encrypted message.
 * @returns {object} - An object containing the tag, encrypted message, and nonce.
 */
export declare function extractParts(cipherText: Uint8Array): {
    nonce: Uint8Array;
    tag: Uint8Array;
    encrypted: Uint8Array;
};
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
export declare function _decrypt(key: Uint8Array, cipherText: Uint8Array): Uint8Array;
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
export declare function decrypt(k1RawSK: Hex, msg: Uint8Array): Buffer;
/**
 * Determines the size of the public key based on whether it is compressed or not.
 *
 * This function checks if ephemeral key compression is enabled by calling `isEphemeralKeyCompressed`.
 * It then returns the size of the public key in bytes: either the compressed (33 bytes) or uncompressed size (65 bytes).
 *
 * @function isCompressed
 * @returns {number} - The size of the public key in bytes. Returns `COMPRESSED_PUBLIC_KEY_SIZE` if the key is compressed,
 *                     otherwise returns `UNCOMPRESSED_PUBLIC_KEY_SIZE`.
 */
export declare function isCompressed(): number;
/**
 * Decodes a signed and encrypted message to retrieve the signature and the encrypted data.
 * @function decodedSignMessage
 * @param {Uint8Array} encodedEncrypt - The signed and encrypted message.
 * @returns {DecodedSignMessage} - An object containing the signature and the encrypted message.
 */
export declare function decodeSignMessage(encodedEncrypt: Uint8Array): DecodeSignMessage;
/**
 * Verifies the signature of a signed message using the provided public key.
 * @function verifyMessage
 * @param {DecodedSignMessage} signatureRS - The decoded signature and encrypted message.
 * @param {string | Uint8Array} publicKey - The public key used to verify the signature, provided either as a hex string or Uint8Array.
 * @returns {VerifyMessage} - An object containing the verification result (boolean) and the original cipher text.
 */
export declare function verifyMessage(signatureRS: DecodeSignMessage, publicKey: Hex): VerifyMessage;
//# sourceMappingURL=decrypt.d.ts.map