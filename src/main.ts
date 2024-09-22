import { PrivateKey } from './lib/PrivateKey'
import { PublicKey } from './lib/PublicKey'
import { Service } from './lib/Service'

/**
 * @class Ts256k1 - Extends the Service class to provide key management and encryption/decryption functionality using secp256k1 and XChaCha20-Poly1305.
 * Inherits methods for encryption, decryption, and key pair validation.
 * @example
 * const k1 = new Ts256k1(privateKey, publicKey);
 * const msg = utf8ToBytes('hello');
 * const encryptedMsg = k1.encrypt(msg);
 * const decryptedMsg = k1.decrypt(encryptedMsg);
 * console.log(decryptedMsg.toString()); // "hello"
 */
export class Ts256k1 extends Service {
  /**
   * Generates a new secp256k1 secret and public key pair.
   * This method provides a new instance of the PrivateKey class.
   *
   * @static
   * @method getKeyPairs
   * @param {Uint8Array} [secret] - Optional secret key in Uint8Array format. If not provided, a random key will be generated.
   * @returns {PrivateKey} - A new PrivateKey instance.
   * @example
   * const k1 = Ts256k1.getKeyPairs();
   * const privateKey = k1.secretToHex();
   * const publicKey = k1.publicKey.toHex();
   * console.log(privateKey, publicKey);
   */
  public static getKeyPairs(secret?: Uint8Array): PrivateKey {
    return new PrivateKey(secret)
  }

  /**
   * Constructs an instance of the Ts256k1 class.
   * This class extends the functionality of the Service class, providing encryption and decryption features using the given key pair.
   *
   * @param {string | Uint8Array} secret - The secret key in either hexadecimal string or Uint8Array format.
   * @param {string | Uint8Array} publicKey - The public key in either hexadecimal string or Uint8Array format.
   * @example
   * const ts = new Ts256k1(secretKey, publicKey);
   */
  constructor(secret: Hex, publicKey: Hex) {
    super(secret, publicKey)
  }
}

export { PrivateKey, PublicKey }
