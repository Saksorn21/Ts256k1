import { combineKeys, getSharedKey, hexToPublicKey } from '../src/utils/elliptic'
import { K1, randomBytes, bytesToHex, hexToBytes } from '../src/utils/'
import { hkdf, sha256 } from '../src/utils/index';

describe('Elliptical Functions', () => {
  it('should combine keys using HKDF and SHA256', () => {
    const masterKey = randomBytes(32) // ตัวอย่าง master key
    const combinedKey = combineKeys(masterKey);

    expect(combinedKey).toBeInstanceOf(Uint8Array);
    expect(combinedKey.length).toBe(32); // ผลลัพธ์ควรยาว 32 ไบต์
  });

  it('should generate shared key from ephemeral and shared points', () => {
    const ephemeralPoint = new Uint8Array([0x05, 0x06, 0x07, 0x08]);
    const sharedPoint = new Uint8Array([0x09, 0x0A, 0x0B, 0x0C]);

    const sharedKey = getSharedKey(ephemeralPoint, sharedPoint);
    expect(sharedKey).toBeInstanceOf(Uint8Array);
    expect(sharedKey.length).toBe(32); // ผลลัพธ์ควรยาว 32 ไบต์
  });

  it('should convert hex string to public key', () => {
    const hex = 'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f'; // ตัวอย่าง hex string
    const publicKey = hexToPublicKey(hex);
   const expectedPublicKey = bytesToHex(K1.getPublicKey(randomBytes(32)))
    const uncomm = new Uint8Array(64)
    uncomm.set(hexToBytes(expectedPublicKey), 1)
    
    expect(hexToPublicKey(bytesToHex(uncomm)).length).toBe(65);
    expect(hexToPublicKey(expectedPublicKey).length).toBe(33);
    expect(publicKey).toBeInstanceOf(Uint8Array);
    // ทดสอบเพิ่มเติมเช่นว่าคีย์ที่ถูกสร้างนั้นถูกต้องหรือไม่
  });
});