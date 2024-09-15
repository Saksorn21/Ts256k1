
import { PrivateKey } from './lib/PrivateKey'
import { encrypt } from './lib/encrypt'
import { decrypt } from './lib/decrypt'

/**
 * @class Ts256k1 - A class for generating and managing 256-bit secret keys, and for encrypting and decrypting messages.
 * @example
 * const k1 = new Ts256k1(privateKey, publicKey);
 * const msg = utf8ToBytes('hello');
 * k1.decrypt(k1.encrypt(msg)).toString();
 *
 * @type {import('ts256k1').Ts256k1} Ts256k1
 */
export class Ts256k1 {
  /**
   * Generate a new secret key and public key pair.
   * 
   * @static
   * @method getKeyPairs
   * @param {Uint8Array} [secret] - An optional secret key in Uint8Array format.
   * @returns {PrivateKey} - A new instance of PrivateKey.
   * @example
   * const k1 = Ts256k1.getKeyPairs();
   * const privateKey = k1.secretToHex();
   * const publicKey = k1.publicKey.toHex();
   * console.log(privateKey, publicKey);
   */
  public static getKeyPairs(secret?: Uint8Array): PrivateKey {
    return new PrivateKey(secret);
  }

  /**
   * Constructor for the Ts256k1 class.
   * 
   * @param {string | Uint8Array} secret - The secret key in either hexadecimal string or Uint8Array format.
   * @param {string | Uint8Array} publicKey - The public key in either hexadecimal string or Uint8Array format.
   */
  constructor(
    private readonly secret: string | Uint8Array, 
    private readonly publicKey: string | Uint8Array
  ) {}

  /**
   * Encrypt a message using the public key.
   * 
   * @method encrypt
   * @param {Uint8Array} msg - The message to be encrypted.
   * @returns {Uint8Array} - The encrypted message.
   */
  public encrypt(msg: Uint8Array): Uint8Array {
    return encrypt(this.publicKey, msg);
  }

  /**
   * Decrypt a message using the secret key.
   * 
   * @method decrypt
   * @param {Uint8Array} msg - The encrypted message.
   * @returns {Uint8Array} - The decrypted message.
   */
  public decrypt(msg: Uint8Array): Uint8Array {
    return decrypt(this.secret, msg);
  }
/** 
  public equals(other: PrivateKey): boolean {
    return equalBytes(this.data, other.data);
  }
  */
}