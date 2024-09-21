import { PrivateKey } from './PrivateKey'
import { K1, bytesToHex, hexToPublicKey, getSharedKey } from '../utils'
import { isHkdfKeyCompressed } from '../config'

/**
 * @class PublicKey - A class that represents a public key.
 */
export class PublicKey {
  /**
   * Create a new instance of PublicKey from a hexadecimal string.
   *
   * @static
   * @method fromHex
   * @param {string} hex - The hexadecimal string representing the public key.
   * @returns {PublicKey} - A new instance of PublicKey.
   */
  public static fromHex(hex: string): PublicKey {
    return new PublicKey(hexToPublicKey(hex))
  }

  private readonly data: Uint8Array

  /**
   * @property {Uint8Array} compressed - The compressed public key.
   * @property {Uint8Array} uncompressed - The uncompressed public key.
   */
  get compressed(): Buffer {
    // Return compressed public key as Uint8Array
    return Buffer.from(this.data)
  }

  get uncompressed(): Buffer {
    // Return uncompressed public key as Uint8Array
    return Buffer.from(this.convertPublicKeyFormat(this.data, false))
  }

  /**
   * @constructor
   * @param {Uint8Array} privateKey - The public key data in Uint8Array format.
   */
  constructor(privateKey: Uint8Array) {
    this.data = this.convertPublicKeyFormat(privateKey, true)
  }

  /**
   * Converts the public key to a hexadecimal string.
   *
   * @method toHex
   * @param {boolean} [compressed=true] - Whether to return the compressed or uncompressed public key.
   * @returns {string} - The hexadecimal representation of the public key.
   */
  public toHex(compressed: boolean = true): string {
    if (compressed) {
      return bytesToHex(this.data)
    } else {
      return bytesToHex(this.uncompressed)
    }
  }

  /**
   * Derives a shared secret using the private key and the current public key.
   *
   * @method decapsulate
   * @param {PrivateKey} sk - The private key used to decapsulate (derive shared secret).
   * @returns {Uint8Array} - The derived shared secret in byte array format.
   */
  public decapsulate(sk: PrivateKey): Uint8Array {
    let senderPoint: Uint8Array
    let sharedPoint: Uint8Array
    if (isHkdfKeyCompressed()) {
      senderPoint = this.data
      sharedPoint = sk.multiply(this, true)
    } else {
      senderPoint = this.uncompressed
      sharedPoint = sk.multiply(this, false)
    }
    return getSharedKey(senderPoint, sharedPoint)
  }

  /**
   * Converts the public key to the specified format (compressed or uncompressed).
   *
   * @method convertPublicKeyFormat
   * @param {Uint8Array} pk - The public key to be converted.
   * @param {boolean} compressed - Whether to convert to the compressed format.
   * @returns {Uint8Array} - The converted public key.
   * @private
   */
  private convertPublicKeyFormat(
    pk: Uint8Array,
    compressed: boolean
  ): Uint8Array {
    return K1.getSharedSecret(BigInt(1), pk, compressed)
  }
}
