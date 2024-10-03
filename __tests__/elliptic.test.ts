import {
  combineKeys,
  getSharedKey,
  hexToPublicKey,
} from '../src/utils/elliptic'
import { bytesToHex } from '../src/utils/'
import { randomBytes } from '../src/utils/noble'

describe('Elliptical Functions', () => {
  it('should combine keys using HKDF and SHA256', () => {
    const masterKey = randomBytes(32) // ตัวอย่าง master key
    const combinedKey = combineKeys(masterKey)

    expect(combinedKey).toBeInstanceOf(Uint8Array)
    expect(combinedKey.length).toBe(32) // ผลลัพธ์ควรยาว 32 ไบต์
  })

  it('should generate shared key from ephemeral and shared points', () => {
    const ephemeralPoint = new Uint8Array([0x05, 0x06, 0x07, 0x08])
    const sharedPoint = new Uint8Array([0x09, 0x0a, 0x0b, 0x0c])

    const sharedKey = getSharedKey(ephemeralPoint, sharedPoint)
    expect(sharedKey).toBeInstanceOf(Uint8Array)
    expect(sharedKey.length).toBe(32) // ผลลัพธ์ควรยาว 32 ไบต์
  })

  it('should convert uncompressed hex string to public key (64 bytes)', () => {
    const hex =
      'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b48' // 32 bytes
    const publicKey = hexToPublicKey(hex + hex)

    // Expecting uncompressed key to have 65 bytes (0x04 + 64 bytes of the original)
    expect(publicKey.length).toBe(65)
    expect(publicKey[0]).toBe(0x04) // Check that the first byte is the correct uncompressed prefix
    expect(publicKey).toBeInstanceOf(Uint8Array)
  })

  it('should handle compressed public key conversion', () => {
    const randomHex = bytesToHex(randomBytes(32)) // Random compressed key case
    const publicKey = hexToPublicKey(randomHex)

    // Expecting compressed key, likely to retain the original size
    expect(publicKey.length).toBeLessThanOrEqual(33) 
    expect(publicKey).toBeInstanceOf(Uint8Array)
  })
})
