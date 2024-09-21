import { Service} from '../src/lib/Service';
import { encodeSign, encrypt } from '../src/lib/encrypt'
import {decodeSignMessage, verifyMessage , decrypt} from '../src/lib/decrypt';

import * as ser from '../src/lib/Service';
import { PrivateKey } from '../src/lib/PrivateKey';
import { PublicKey } from '../src/lib/PublicKey';
import {randomBytes, K1} from '../src/utils'
import { signEnabled, signThrowOnInvalid, signErrorMessage } from '../src/config';

jest.mock('../src/lib/encrypt', () => ({
  encrypt: jest.fn(),
  encodeSign: jest.fn(),
}));
jest.mock('../src/lib/decrypt', () => ({
  decrypt: jest.fn(),
  decodeSignMessage: jest.fn(),
  verifyMessage: jest.fn(),
}));

jest.mock('../src/config', () => ({
  signEnabled: jest.fn(),
  signThrowOnInvalid: jest.fn(),
  signErrorMessage: jest.fn(),
  ConstsType: {
    SECRET_KEY_LENGTH: 32,
      COMPRESSED_PUBLIC_KEY_SIZE: 33,
      UNCOMPRESSED_PUBLIC_KEY_SIZE: 65,
      ETH_PUBLIC_KEY_SIZE: 64,
      SIGNATURE_SIZE: 64,
      XCHACHA20_NONCE_LENGTH: 24,
      AEAD_TAG_LENGTH: 16,
  },
}));

describe('Service Class', () => {
  const k1 = new PrivateKey(randomBytes(32))
  const mockPrivateKey = k1.secretToHex
  const mockPublicKey = k1.publicKey.compressed
  const service = new ser.Service(mockPrivateKey, mockPublicKey);
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('encrypt method', () => {
    it('should encrypt a message and return encrypted data', () => {
      const message = new Uint8Array([1, 2, 3]);
      const encryptedMessage = Buffer.from([4, 5, 6]);

      (encrypt as jest.Mock).mockReturnValue(encryptedMessage);
      (signEnabled as jest.Mock).mockReturnValue(false);

      const result = service.encrypt(message);
      expect(result).toEqual(encryptedMessage);
      expect(encrypt).toHaveBeenCalledWith(mockPublicKey, message);
    });

    it('should encrypt and sign a message if signing is enabled', () => {
      const message = new Uint8Array([1, 2, 3]);
      const encryptedMessage = Buffer.from([4, 5, 6]);
      const signedMessage = Buffer.from([7, 8, 9]);

      (encrypt as jest.Mock).mockReturnValue(encryptedMessage);
      (signEnabled as jest.Mock).mockReturnValue(true);
      (encodeSign as jest.Mock).mockReturnValue(signedMessage);

      const result = service.encrypt(message);
      expect(result).toEqual(signedMessage);
      expect(encodeSign).toHaveBeenCalledWith(encryptedMessage, mockPrivateKey);
    });
  });

  describe('decrypt method', () => {
    it('should decrypt a message without signature verification if signing is disabled', () => {
      const encryptedMessage = new Uint8Array([4, 5, 6]);
      const decryptedMessage = Buffer.from([1, 2, 3]);

      (decrypt as jest.Mock).mockReturnValue(decryptedMessage);
      (signEnabled as jest.Mock).mockReturnValue(false);

      const result = service.decrypt(encryptedMessage);
      expect(result).toEqual(decryptedMessage);
      expect(decrypt).toHaveBeenCalledWith(mockPrivateKey, encryptedMessage);
    });

    it('should decrypt and verify a signed message if signing is enabled', () => {
      const encryptedMessage = new Uint8Array([7, 8, 9]);
      const decryptedMessage = Buffer.from([1, 2, 3]);
      const cipherText = new Uint8Array([10, 11]);

      (signEnabled as jest.Mock).mockReturnValue(true);
      (decodeSignMessage as jest.Mock).mockReturnValue({ cipherText });
      (verifyMessage as jest.Mock).mockReturnValue({ verify: true, cipherText });
      (decrypt as jest.Mock).mockReturnValue(decryptedMessage);

      const result = service.decrypt(encryptedMessage);
      expect(result).toEqual(decryptedMessage);
      expect(verifyMessage).toHaveBeenCalled();
    });

    it('should throw an error if the signature is invalid and throwOnInvalid is true', () => {
      const encryptedMessage = new Uint8Array([7, 8, 9]);

      (signEnabled as jest.Mock).mockReturnValue(true);
      (decodeSignMessage as jest.Mock).mockReturnValue({});
      (verifyMessage as jest.Mock).mockReturnValue({ verify: false });

      (signThrowOnInvalid as jest.Mock).mockReturnValue(true);
      (signErrorMessage as jest.Mock).mockReturnValue('Invalid signature');

      expect(() => service.decrypt(encryptedMessage)).toThrow('Invalid signature');
    });

    it('should not throw an error if the signature is invalid and throwOnInvalid is false', () => {
        const encryptedMessage = new Uint8Array([7, 8, 9]);

        (signEnabled as jest.Mock).mockReturnValue(true);
        (decodeSignMessage as jest.Mock).mockReturnValue({});
        (verifyMessage as jest.Mock).mockReturnValue({ verify: false });

        (signThrowOnInvalid as jest.Mock).mockReturnValue(false);

        expect(() => service.decrypt(encryptedMessage)).not.toThrow();
    });
  });

  describe('equals method', () => {
    it('should return true for equal PrivateKeys', () => {
      const privateKeyInstance = PrivateKey.fromHex(mockPrivateKey);

      expect(service.equals(privateKeyInstance)).toBe(true);
    });

    it('should return true for equal PublicKeys', () => {
        const publicKeyInstance = k1.publicKey

      expect(service.equals(publicKeyInstance)).toBe(true);
    });

    it('should throw TypeError for invalid comparison type', () => {
        expect(() => service.equals({} as PrivateKey)).toThrow(TypeError);
    });

    it('should return false for unequal keys', () => {
        const differentPrivateKeyInstance = new PrivateKey(randomBytes(32));

        expect(service.equals(differentPrivateKeyInstance)).toBe(false);
    });

    it('should return false for unequal public keys', () => {
        const differentPublicKeyInstance = new PublicKey(K1.getPublicKey(randomBytes(32)));

        expect(service.equals(differentPublicKeyInstance)).toBe(false);
    });
    
    it('should return false for unequal public keys uncompressed', () => {
      const differentService = new Service(mockPrivateKey, k1.publicKey.uncompressed)
        const differentPublicKeyInstance = new PublicKey(K1.getPublicKey(randomBytes(32)));

        expect(differentService.equals(differentPublicKeyInstance)).toBe(false);
    });
});

});