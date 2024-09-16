/**
 * @interface DecodedSignMessage
 * @property {Uint8Array} signBytes - The signature of the message.
 * @property {Uint8Array} encryptMessage - The encrypted message.
 */
export declare interface DecodedSignMessage {
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
 * Decodes a signed and encrypted message to retrieve the signature and the encrypted data.
 * @function decodedSignMessage
 * @param {Uint8Array} encodedEncrypt - The signed and encrypted message.
 * @returns {DecodedSignMessage} - An object containing the signature and the encrypted message.
 */
export declare function decodedSignMessage(encodedEncrypt: Uint8Array): DecodedSignMessage;
/**
 * Verifies the signature of a signed message using the provided public key.
 * @function verifyMessage
 * @param {DecodedSignMessage} signatureRS - The decoded signature and encrypted message.
 * @param {string | Uint8Array} publicKey - The public key used to verify the signature, provided either as a hex string or Uint8Array.
 * @returns {VerifyMessage} - An object containing the verification result (boolean) and the original cipher text.
 */
export declare function verifyMessage(signatureRS: DecodedSignMessage, publicKey: Hex): VerifyMessage;
//# sourceMappingURL=decrypt.d.ts.map