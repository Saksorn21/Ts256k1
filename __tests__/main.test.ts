import { Ts256k1 } from '../src/main'
import { PrivateKey } from '../src/lib/PrivateKey';
import { PublicKey } from '../src/lib/PublicKey'
import { randomBytes, bytesToHex, hexToBytes, bytesToUtf8, K1 } from '../src/utils'


describe("class main Ts256k1 implements Service", () => {
  const k32 = randomBytes(32)
  const ts256 = Ts256k1.getKeyPairs(k32)
  
    it("should throw an error if private key is invalid (not 32 bytes)", () => {
      ///throw Error is not secret 32 Bytes
      expect(() => Ts256k1.getKeyPairs(randomBytes(10))).toThrow('Invalid private key');
    })
  it("should return valid key pair from static getKeyPairs method", () => {
    
    const pk = ts256.publicKey //instanceof PublicKey
    const pkHexcom = pk.toHex()
    const pkHexuncom = pk.toHex(false)
    const sk = ts256 // instanceof PrivateKey
    const skU8 = sk.secret
    const skB = sk.secretToHex
    
    // PublicKey to Hex is compressed or uncompressed
    expect(pkHexuncom).toStrictEqual(bytesToHex(ts256.publicKey.uncompressed))
  expect(pkHexcom).toStrictEqual(bytesToHex(ts256.publicKey.compressed))
    expect(pk.uncompressed.length).toBe(65)
    expect(pk.compressed.length).toBe(33)
    expect(skU8.length).toBe(32)
   expect(skB.length).toBe(64)
    expect(skU8).toBeInstanceOf(Uint8Array)
    expect(sk).toBeInstanceOf(PrivateKey)
    expect(pk).toBeInstanceOf(PublicKey)
    expect(Uint8Array.from(hexToBytes(pkHexcom))).toEqual(Uint8Array.from(pk.compressed))
    expect(Uint8Array.from(hexToBytes(pk.toHex(false)))).toEqual(Uint8Array.from(pk.uncompressed))
    
    
  })
  it("should encrypt and decrypt correctly in Ts256k1 class", () => {
    const ts256k1 = new Ts256k1(ts256.secret, ts256.publicKey.toHex())
    expect(ts256k1).toBeInstanceOf(Ts256k1)
  })
  it("should correctly encrypt and decrypt a message", () => {
    const ts256k1 = new Ts256k1(ts256.secret, ts256.publicKey.toHex())
    const msg = new Uint8Array(Buffer.from('hello world'))
    const enc = ts256k1.encrypt(msg)
    expect(enc).toBeInstanceOf(Buffer)
    const dec = ts256k1.decrypt(enc)
    expect(dec).toBeInstanceOf(Buffer)
    expect(dec.toString()).toEqual(bytesToUtf8(msg))
    
  })

  })

describe('equals method in Ts256k1 class', () => {
  const key = Ts256k1.getKeyPairs(randomBytes(32));
  const k1 = new Ts256k1(key.secret, key.publicKey.toHex());

  it('should return true for equal PrivateKeys', () => {
    expect(k1.equals(key)).toBe(true);
  });

  it('should return true for equal PublicKeys', () => {
      const publicKeyInstance = key.publicKey

    expect(k1.equals(publicKeyInstance)).toBe(true);
  });

  it('should throw TypeError for invalid comparison type', () => {
    
      expect(() => k1.equals(({}) as PrivateKey)).toThrow(`Type mismatch: Expected instance of PrivateKey or PublicKey, but got object.`);
  });

  it('should return false for unequal private keys', () => {
      const differentPrivateKeyInstance = new PrivateKey(randomBytes(32));

      expect(k1.equals(differentPrivateKeyInstance)).toBe(false);
  });

  it('should return false for unequal public keys', () => {
      const differentPublicKeyInstance = new PublicKey(K1.getPublicKey(randomBytes(32)));

      expect(k1.equals(differentPublicKeyInstance)).toBe(false);
  });
});
