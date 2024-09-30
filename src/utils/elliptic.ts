import { concatBytes, hkdf, sha256 } from './noble'
import { decodeHex } from './bytes'
import { ConstsType } from '../config'

export function combineKeys(master: Uint8Array): Uint8Array {
  return hkdf(sha256, master, undefined, undefined, 32)
}
export function getSharedKey(
  ephemeralPoint: Uint8Array,
  sharedPoint: Uint8Array
): Uint8Array {
  return combineKeys(concatBytes(ephemeralPoint, sharedPoint))
}

export function hexToPublicKey(hex: string): Uint8Array {
  const decoded = decodeHex(hex)
  //If 64 bytes, then it's a uncompressed key
  if (decoded.length === ConstsType.ETH_PUBLIC_KEY_SIZE) {
    const fixed = new Uint8Array(1 + decoded.length)
    fixed.set([0x04])
    fixed.set(decoded, 1)

    return fixed
  }
  return decoded
}
