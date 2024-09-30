import {
  decrypt,
  decodeSignMessage,
  verifyMessage,
  extractParts,
} from '../src/lib/decrypt'
import { encrypt } from '../src/lib/encrypt'
import { utf8ToBytes, bytesToHex } from '../src/utils'
import { randomBytes } from '../src/utils/noble'
import { PrivateKey } from '../src/main'
import * as config from '../src/config'
describe('Decryption Tests', () => {
  const message = utf8ToBytes('Hello, World!')
  let publicKey: Buffer
  let privateKey: PrivateKey
  let encryptedMessage: Buffer | Uint8Array

  beforeEach(() => {
    privateKey = new PrivateKey(
      randomBytes(config.ConstsType.SECRET_KEY_LENGTH)
    )
    encryptedMessage = Uint8Array.from(
      encrypt(privateKey.publicKey.toHex(), message)
    )
  })

  it('should encrypt and decrypt the message with compressed public key', () => {
    // Mock isHkdfKeyCompressed to return true for compressed keys
    config.TS256K1_CONFIG.isHkdfKeyCompressed = true
    config.TS256K1_CONFIG.isEphemeralKeyCompressed = true

    // Generate a compressed public key and encrypt the message
    publicKey = privateKey.publicKey.compressed
    encryptedMessage = encrypt(bytesToHex(publicKey), message)

    // Decrypt the message and check if it matches the original
    const decryptedMessage = decrypt(privateKey.secretToHex, encryptedMessage)
    expect(decryptedMessage.toString('utf8')).toBe('Hello, World!')
  })

  it('should encrypt and decrypt the message with uncompressed public key', () => {
    // Mock isHkdfKeyCompressed to return false for uncompressed keys
    config.TS256K1_CONFIG.isHkdfKeyCompressed = false
    config.TS256K1_CONFIG.isEphemeralKeyCompressed = false
    // Generate an uncompressed public key and encrypt the message
    publicKey = privateKey.publicKey.uncompressed
    encryptedMessage = encrypt(publicKey, message)

    // Decrypt the message and check if it matches the original
    const decryptedMessage = decrypt(privateKey.secretToHex, encryptedMessage)
    expect(decryptedMessage.toString('utf8')).toBe('Hello, World!')
  })

  it('should correctly decode the signed message', () => {
    // Simulate a signed message (signature + encrypted message)
    const signature = new Uint8Array(config.ConstsType.SIGNATURE_SIZE) // Mock signature
    const signedMessage = Uint8Array.from(
      Buffer.concat([signature, encryptedMessage])
    )

    // Use decodeSignMessage to extract the signature and encrypted message
    const decoded = decodeSignMessage(signedMessage)

    // Verify the extracted signature and message
    expect(decoded.signBytes).toEqual(signature)
    expect(decoded.encryptMessage).toEqual(encryptedMessage)
  })

  it('should verify the message signature correctly', () => {
    // Mock public key and signature
    const signature = new Uint8Array(config.ConstsType.SIGNATURE_SIZE) // Mock signature
    const signedMessage = Uint8Array.from(
      Buffer.concat([signature, encryptedMessage])
    )
    const decoded = decodeSignMessage(signedMessage)
    //publicKey = privateKey.publicKey.compressed
    // Verify the signature using verifyMessage
    const verifyResult = verifyMessage(decoded, bytesToHex(publicKey))

    // Expect the signature to be verified as false (since we used a random signature)
    expect(verifyResult.verify).toBe(false)
    expect(verifyResult.cipherText).toEqual(encryptedMessage)
  })

  test('should extract parts from cipher text', () => {
    const cipherText = new Uint8Array([
      ...randomBytes(24),
      ...new Uint8Array(16),
      ...encryptedMessage,
    ])

    const { nonce, tag, encrypted } = extractParts(cipherText)

    expect(nonce.length).toBe(24)
    expect(tag.length).toBe(16)
    expect(encrypted.length).toBe(encryptedMessage.length)
  })
})
