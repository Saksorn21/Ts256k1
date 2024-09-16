import { encrypt, encodeSign } from './encrypt'
import { 
  decrypt, 
  verifyMessage, 
  decodedSignMessage, 
  type VerifyMessage, 
  type DecodedSignMessage
} from './decrypt'
import { signThrowMessage } from '../config';

/**
 * @class Service
 * A class that handles encryption, decryption, and message signing/verification.
 */
export class Service {
  /**
   * @constructor
   * Initializes a new instance of the Service class.
   * @param {string | Uint8Array} privateKeyA - The private key used to sign and decrypt the message.
   * @param {string | Uint8Array} publicKeyA - The public key used to encrypt the message.
   */
  constructor (
    private readonly privateKeyA: Hex,
    private readonly publicKeyA: Hex
  ) { }

  /**
   * Encrypts a message using the provided public key and signs the encrypted data using the private key.
   * 
   * @param {Uint8Array} message - The message to be encrypted.
   * @returns {Buffer} - A Buffer containing the signed and encrypted message.
   */
  public encrypt (message: Uint8Array): Buffer {
    // Encrypt the message using the public key
    const dataEncrypted: Uint8Array = encrypt(this.publicKeyA, message)

    // Sign the encrypted message using the private key
    const encodeSignMessage: Buffer = encodeSign(dataEncrypted, this.privateKeyA)
    return encodeSignMessage
  }

  /**
   * Decrypts a message and verifies its signature.
   * 
   * @param {Uint8Array} messageEncrypt - The signed and encrypted message to be decrypted.
   * @returns {Buffer} - The decrypted message if the signature is valid.
   * @throws {Error} - Throws an error if the signature is invalid.
   */
  public decrypt (messageEncrypt: Uint8Array): Buffer {
    // Decode the signed and encrypted message, then verify the signature
    const { verify, cipherText }: VerifyMessage = verifyMessage(
      (decodedSignMessage(messageEncrypt) as DecodedSignMessage), 
      this.publicKeyA
    )

    // If the signature is not valid, throw an error
    if (!verify) throw new Error(signThrowMessage())

    // If the signature is valid, decrypt the cipher text using the private key
    return decrypt(this.privateKeyA, cipherText)
  }
}