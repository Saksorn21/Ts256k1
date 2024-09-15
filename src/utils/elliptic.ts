
import {
  K1, 
  concatBytes,
  hkdf,
  sha256,
  decodeHex
  } from './index';

import { ETH_PUBLIC_KEY_SIZE, } from "../config"

export function getSharedPoint(
  sc: Uint8Array, 
  pk: Uint8Array, 
  isCompressed?: boolean) { return K1.getSharedSecret(sc, pk, isCompressed) }
export function deriveKey (master: Uint8Array): Uint8Array { return hkdf(sha256, master, undefined, undefined, 32) }
export function getSharedKey (
    ephemeralPoint: Uint8Array,
    sharedPoint: Uint8Array
  ): Uint8Array { return deriveKey(concatBytes(ephemeralPoint, sharedPoint)) }

export function hexToPublicKey (hex: string): Uint8Array  {
  const decoded = decodeHex(hex)
    if (decoded.length === ETH_PUBLIC_KEY_SIZE) {
      const fixed = new Uint8Array(1 + decoded.length)
        fixed.set([0x04])
        fixed.set(decoded, 1)
    return fixed
    }
    return decoded
  }
