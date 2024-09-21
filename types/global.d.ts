import type { PrivateKey } from '../lib/PrivateKey'
import type { PublicKey } from '../lib/PublicKey'

declare global {

  /**
   * @type Hex
   * @description A type alias for a hexadecimal string.
   */
  type Hex = string | Uint8Array
  
  /**
   * @interface Config256k1
   * @description An interface for the configuration options.
   * @property {boolean} hkdfKeyCompressed - Indicates whether the HKDF key should be compressed.
   * @property {boolean} ephemeralKeyCompressed - Indicates whether the ephemeral key should be compressed.
   * @property {object} signature - An object containing the signature options.
   * @property {boolean} signature.enabled - Indicates whether the signature should be enabled.
   * @property {boolean} signature.throwOnInvalid - Indicates whether to throw an error if the signature is invalid.
   * @property {string} signature.errorMessage - The error message to be thrown if the signature is invalid.
   * @property {boolean} signature.useLowS - Indicates whether the signature should use low S.
   */
  interface Config256k1 {
      hkdfKeyCompressed: boolean;
      ephemeralKeyCompressed: boolean;
      signature: {
        enabled: boolean;
        throwOnInvalid: boolean;
        useLowS: boolean;
        errorMessage: string;
      }
  }
  interface BaseTs256k1 {
    encrypt(msg: Uint8Array): Uint8Array
    decrypt(msg: Uint8Array): Uint8Array
    equals(other: PrivateKey | PublicKey): boolean
  }
  
}
export {}
