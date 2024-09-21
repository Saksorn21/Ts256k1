import { K1, xchacha20, concatBytes, sha256 } from '../utils'
import { ConstsType, isEphemeralKeyCompressed } from '../config'

import { PrivateKey } from './PrivateKey'
import { PublicKey } from './PublicKey'

/**
 * @interface DecodedSignMessage
 * @property {Uint8Array} signBytes - The signature of the message.
 * @property {Uint8Array} encryptMessage - The encrypted message.
 */
export declare interface DecodeSignMessage {
  signBytes: Uint8Array
  encryptMessage: Uint8Array
}

/**
 * @interface  VerifyMessage
 * @property {boolean} verify - The signature of the message.
 * @property {Uint8Array} cipherText - The encrypted message.
 */
export declare interface VerifyMessage {
  verify: boolean
  cipherText: Uint8Array
}
/**
 * Helper function to extract nonce, tag, and encrypted data.
 * @function extractParts
 * @param {Uint8Array} cipherText - The encrypted message.
 * @returns {object} - An object containing the tag, encrypted message, and nonce.
 */

export function extractParts(cipherText: Uint8Array): {
  nonce: Uint8Array
  tag: Uint8Array
  encrypted: Uint8Array
} {
  const nonceTagLength =
    ConstsType.XCHACHA20_NONCE_LENGTH + ConstsType.AEAD_TAG_LENGTH

  // Extract the nonce, tag, and encrypted message from the cipherText
  const nonce = cipherText.subarray(0, ConstsType.XCHACHA20_NONCE_LENGTH)
  const tag = cipherText.subarray(
    ConstsType.XCHACHA20_NONCE_LENGTH,
    nonceTagLength
  )
  const encrypted = cipherText.subarray(nonceTagLength)

  return { nonce, tag, encrypted }
}
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
// Decryption function
export function _decrypt(key: Uint8Array, cipherText: Uint8Array): Uint8Array {
  // Extract nonce, tag, and encrypted message
  const { nonce, tag, encrypted } = extractParts(cipherText)

  // Create the decipher using xchacha20
  const decipher = xchacha20(key, nonce)

  // Combine the encrypted message and tag
  const ciphered = concatBytes(encrypted, tag)

  // Create a buffer for decryption
  const buffer = new Uint8Array(ciphered.length)
  buffer.set(ciphered, 0)

  // Decrypt the message
  const decrypted = decipher.decrypt(
    buffer,
    buffer.subarray(0, encrypted.length)
  )

  return decrypted
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
export function decrypt(k1RawSK: Hex, msg: Uint8Array): Buffer {
  const temporaryStorageKey =
    k1RawSK instanceof Uint8Array
      ? new PrivateKey(k1RawSK)
      : PrivateKey.fromHex(k1RawSK)

  const keySize: number = isCompressed()
  const senderPK: PublicKey = new PublicKey(msg.subarray(0, keySize))
  const encrypt = msg.subarray(keySize)
  const symKey = senderPK.decapsulate(temporaryStorageKey)
  // const decodedSign = verifyMessage(signBytes,symKey)
  //console.log(decodedSign)
  return Buffer.from(_decrypt(symKey, encrypt))
}

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
export function isCompressed(): number {
  // Check the configuration to determine if ephemeral key compression is enabled.
  return isEphemeralKeyCompressed()
    ? ConstsType.COMPRESSED_PUBLIC_KEY_SIZE
    : ConstsType.UNCOMPRESSED_PUBLIC_KEY_SIZE
}

/**
 * Decodes a signed and encrypted message to retrieve the signature and the encrypted data.
 * @function decodedSignMessage
 * @param {Uint8Array} encodedEncrypt - The signed and encrypted message.
 * @returns {DecodedSignMessage} - An object containing the signature and the encrypted message.
 */
export function decodeSignMessage(
  encodedEncrypt: Uint8Array
): DecodeSignMessage {
  const sign = encodedEncrypt.subarray(0, ConstsType.SIGNATURE_SIZE)
  const encrypted = encodedEncrypt.subarray(ConstsType.SIGNATURE_SIZE)

  return {
    signBytes: sign,
    encryptMessage: encrypted,
  }
}

/**
 * Verifies the signature of a signed message using the provided public key.
 * @function verifyMessage
 * @param {DecodedSignMessage} signatureRS - The decoded signature and encrypted message.
 * @param {string | Uint8Array} publicKey - The public key used to verify the signature, provided either as a hex string or Uint8Array.
 * @returns {VerifyMessage} - An object containing the verification result (boolean) and the original cipher text.
 */
export function verifyMessage(
  signatureRS: DecodeSignMessage,
  publicKey: Hex
): VerifyMessage {
  const { signBytes, encryptMessage } = signatureRS
  const encryptHex = sha256(encryptMessage)
  const verify = K1.verify(signBytes, encryptHex, publicKey)

  return {
    verify: verify,
    cipherText: encryptMessage,
  }
}
