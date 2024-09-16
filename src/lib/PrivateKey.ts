
import { PublicKey } from './PublicKey';
import { isHkdfKeyCompressed, ConstsType } from '../config';

import { 
  K1,
  getSharedKey,
  decodeHex,
  bytesToHex,
  randomBytes
} from '../utils';

const { getPublicKey, getSharedSecret, utils } = K1
/**
 * @class PrivateKey - A class that represents a private key.
 */
export class PrivateKey {
  /**
   * Generates a new private key from a hexadecimal string.
   *
   * @static
   * @method fromHex
   * @param {string} hex - The hexadecimal string representing the private key.
   * @returns {PrivateKey} - A new instance of PrivateKey.
   */
  public static fromHex(hex: string): PrivateKey {
    return new PrivateKey(decodeHex(hex));
  }

  private readonly data: Uint8Array;

  /**
   * The public key derived from the private key.
   *
   * @property {PublicKey} publicKey - The public key that corresponds to this private key.
   */
  public readonly publicKey: PublicKey;

  /**
   * Retrieves the secret key as a Uint8Array.
   * 
   * @property {Uint8Array} secret - The secret key in byte array format.
   * @returns {Uint8Array} - The secret key as a byte array (Uint8Array).
   */
  get secret(): Uint8Array {
    return Buffer.from(this.data);
  }

  /**
   * Converts the secret key to a hexadecimal string.
   * 
   * @property {string} secretToHex - The secret key in hexadecimal format.
   * @returns {string} - The hexadecimal representation of the secret key.
   */
  get secretToHex(): string {
    return bytesToHex(this.data);
  }

  /**
   * Constructor for the PrivateKey class.
   *
   * @constructor
   * @param {Uint8Array} [secret] - Optional secret key in Uint8Array format. If not provided, a valid secret will be generated.
   * @throws {Error} If the secret key is invalid.
   */
  constructor(secret?: Uint8Array) {
    const sk = secret ? secret : this.getValidSecret();
    if (!this.validateSecret(sk)) throw new Error('Invalid private key');
    this.data = sk;
    this.publicKey = new PublicKey(this.getPublicKey(sk));
  }

  /**
   * Encapsulates the private key with the given public key to derive a shared secret.
   *
   * @method encapsulate
   * @param {PublicKey} pk - The public key to use for encapsulation.
   * @returns {Uint8Array} - The derived shared secret.
   */
  public encapsulate(pk: PublicKey): Uint8Array {
    let senderPoint: Uint8Array;
    let sharedPoint: Uint8Array;
    if (isHkdfKeyCompressed()) {
      senderPoint = this.publicKey.compressed;
      sharedPoint = this.multiply(pk, true);
    } else {
      senderPoint = this.publicKey.uncompressed;
      sharedPoint = this.multiply(pk, false);
    }
    return getSharedKey(senderPoint, sharedPoint);
  }

  /**
   * Multiplies the private key with the given public key to derive a shared point.
   *
   * @method multiply
   * @param {PublicKey} pk - The public key to multiply with.
   * @param {boolean} [compressed=false] - Whether the public key is in compressed format.
   * @returns {Uint8Array} - The derived shared point.
   */
  public multiply(pk: PublicKey, compressed: boolean = false): Uint8Array {
    //TODO: .slice(1) - remove 0x
    return getSharedSecret(this.data, pk.compressed, compressed).slice(1)
  }

  /**
   * Validates whether the given secret key is valid.
   *
   * @method validateSecret
   * @param {Uint8Array} secret - The secret key to validate.
   * @returns {boolean} - True if the secret key is valid, otherwise false.
   */
  private validateSecret(secret: Uint8Array): boolean {
    return utils.isValidPrivateKey(secret);
  }

  /**
   * Generates a valid secret key.
   *
   * @method getValidSecret
   * @returns {Uint8Array} - A valid secret key.
   */
  private getValidSecret(): Uint8Array {
    let secret: Uint8Array;
    do {
      secret = randomBytes(ConstsType.SECRET_KEY_LENGTH)
    } while (!this.validateSecret(secret));

    return secret
  }

  /**
   * Derives the public key associated with the given private key.
   *
   * @method getPublicKey
   * @param {Uint8Array} secret - The private key to derive the public key from.
   * @returns {Uint8Array} - The corresponding public key.
   */
  private getPublicKey(secret: Uint8Array): Uint8Array {
    return getPublicKey(secret)
  }
}