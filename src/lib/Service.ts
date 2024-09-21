import { encrypt, encodeSign } from './encrypt'
import {
  decrypt,
  verifyMessage,
  decodeSignMessage,
  type VerifyMessage,
  type DecodeSignMessage,
} from './decrypt'
import {
  signEnabled,
  signThrowOnInvalid,
  signErrorMessage,
  ConstsType,
} from '../config'
import { equalBytes, normalizeToUint8Array } from '../utils'
import { PrivateKey } from './PrivateKey'
import { PublicKey } from './PublicKey'

/**
 * @class Service
 * A class that handles encryption, decryption, and message signing/verification.
 */
export class Service {
  /**
   * Initializes a new instance of the Service class.
   *
   * @constructor
   * @param {string | Uint8Array} privateKeyA - The private key used for signing and decrypting messages.
   * @param {string | Uint8Array} publicKeyA - The public key used for encrypting messages.
   */
  constructor(
    private readonly privateKeyA: Hex,
    private readonly publicKeyA: Hex
  ) {}

  /**
   * Encrypts a message using the provided public key, and signs the encrypted data using the private key
   * if signature signing is enabled.
   *
   * @param {Uint8Array} message - The plaintext message to be encrypted.
   * @returns {Buffer} - A Buffer containing the signed and encrypted message, or just the encrypted message
   *                     if signing is disabled.
   */
  public encrypt(message: Uint8Array): Buffer {
    // Encrypt the message using the public key
    const dataEncrypted: Buffer = encrypt(this.publicKeyA, message)

    // If signing is enabled, sign the encrypted message using the private key and return the signed message
    if (signEnabled()) {
      const encodeSignMessage: Buffer = encodeSign(
        dataEncrypted,
        this.privateKeyA
      )

      return encodeSignMessage
    }

    // If signing is not enabled, return only the encrypted data
    return dataEncrypted
  }

  /**
   * Decrypts a signed and encrypted message, and verifies its signature if signing is enabled.
   *
   * @param {Uint8Array} messageEncrypt - The signed and encrypted message to be decrypted.
   * @returns {Buffer} - The decrypted plaintext message if the signature is valid or if signing is disabled.
   * @throws {Error} - Throws an error if the signature is invalid and `throwOnInvalid` is set to true.
   */
  public decrypt(messageEncrypt: Uint8Array): Buffer {
    let cipherText = messageEncrypt

    // If signing is enabled, verify the signature
    if (signEnabled()) {
      // Decode and verify the signed message
      const { verify, cipherText }: VerifyMessage = verifyMessage(
        decodeSignMessage(messageEncrypt) as DecodeSignMessage,
        this.publicKeyA
      )

      // Check the configuration to determine If the signature is invalid and `throwOnInvalid` is true, throw an error
      if (signThrowOnInvalid() && !verify) throw new Error(signErrorMessage()) // Check the configuration to determine `signErrorMessage` is a function that returns the error message

      // If the signature is valid, decrypt the ciphertext
      return decrypt(this.privateKeyA, cipherText)
    }

    // If signing is not enabled, directly decrypt the message without signature verification
    return decrypt(this.privateKeyA, cipherText)
  }

  /**
   * Compares this key with another PrivateKey or PublicKey instance.
   * Converts the current key to a Uint8Array if it is in hex format.
   * If the current publicKeyA is compressed, it compares it with the compressed version of the other PublicKey.
   * Otherwise, it compares with the uncompressed version.
   *
   * @method equals
   * @param {PrivateKey | PublicKey} other - The PrivateKey or PublicKey instance to compare with.
   * @returns {boolean} - Returns true if the two instances are equal, false otherwise.
   * @throws {TypeError} - Throws an error if `other` is neither a PrivateKey nor a PublicKey instance.
   */
  public equals(other: PrivateKey | PublicKey): boolean {
    // Check if other is a PrivateKey and compare
    if (other instanceof PrivateKey) {
      const privA = normalizeToUint8Array(this.privateKeyA)
      return equalBytes(privA, other.secret)
    }

    // Check if other is a PublicKey and compare
    if (other instanceof PublicKey) {
      const pubA = normalizeToUint8Array(this.publicKeyA)
      // If publicKeyA is compressed, compare compressed versions, otherwise compare uncompressed versions
      const data =
        pubA.length === ConstsType.COMPRESSED_PUBLIC_KEY_SIZE
          ? other.compressed
          : other.uncompressed
      return equalBytes(pubA, data)
    }

    // If neither condition matches, throw error
    throw new TypeError(
      `Type mismatch: Expected instance of PrivateKey or PublicKey, but got ${typeof other}.`
    )
  }
}
export { encrypt, encodeSign, decrypt, decodeSignMessage, verifyMessage }
