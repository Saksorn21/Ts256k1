import { encrypt, encodeSign } from './encrypt'
import { 
  decrypt, 
  verifyMessage, 
  decodedSignMessage, 
  type VerifyMessage, 
  type DecodedSignMessage
} from './decrypt'
import { 
  signEnabled, 
  signThrowOnInvalid,
  signErrorMessage
} from '../config';

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
    const dataEncrypted: Buffer = encrypt(this.publicKeyA, message);

    // If signing is enabled, sign the encrypted message using the private key and return the signed message
    if (signEnabled()) {
      const encodeSignMessage: Buffer = encodeSign(dataEncrypted, this.privateKeyA);
      return encodeSignMessage;
    }

    // If signing is not enabled, return only the encrypted data
    return dataEncrypted;
  }

  /**
   * Decrypts a signed and encrypted message, and verifies its signature if signing is enabled.
   * 
   * @param {Uint8Array} messageEncrypt - The signed and encrypted message to be decrypted.
   * @returns {Buffer} - The decrypted plaintext message if the signature is valid or if signing is disabled.
   * @throws {Error} - Throws an error if the signature is invalid and `throwOnInvalid` is set to true.
   */
  public decrypt(messageEncrypt: Uint8Array): Buffer {
    let cipherText = messageEncrypt;

    // If signing is enabled, verify the signature
    if (signEnabled()) {
      // Decode and verify the signed message
      const { verify, cipherText }: VerifyMessage = verifyMessage(
        decodedSignMessage(messageEncrypt) as DecodedSignMessage,
        this.publicKeyA
      );

      // If the signature is invalid and `throwOnInvalid` is true, throw an error
      if (signThrowOnInvalid() && !verify) 
        throw new Error(signErrorMessage());
      

      // If the signature is valid, decrypt the ciphertext
      return decrypt(this.privateKeyA, cipherText);
    }

    // If signing is not enabled, directly decrypt the message without signature verification
    return decrypt(this.privateKeyA, cipherText);
  }
}