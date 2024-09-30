import { encrypt, encodeSign } from '../src/lib/encrypt';
import { utf8ToBytes } from '../src/utils';
import { randomBytes } from '../src/utils/noble';
import { PublicKey, PrivateKey } from '../src/main';
import { ConstsType } from '../src/config';

describe('Encryption Tests', () => {
  const message = utf8ToBytes('Hello, World!');
  let publicKey: PublicKey;
  let privateKey: PrivateKey;

  beforeEach(() => {
    privateKey = new PrivateKey(randomBytes(ConstsType.SECRET_KEY_LENGTH));
    publicKey = privateKey.publicKey;
  });

  it('should encrypt the message with a public key', () => {
    const encryptedMessage = encrypt(publicKey.toHex(), message);
    expect(encryptedMessage).toBeInstanceOf(Buffer);
    expect(encryptedMessage.length).toBeGreaterThan(message.length);
  });

  it('should throw an error for invalid public key', () => {
    const invalidPublicKey = 'invalid-public-key';
    expect(() => encrypt(invalidPublicKey, message)).toThrow();
  });

  it('should return encrypted message with signature', () => {
    const encryptedMessage = encrypt(publicKey.toHex(), message);
    const signedMessage = encodeSign(encryptedMessage, privateKey.secret);

    expect(signedMessage).toBeInstanceOf(Buffer);
    expect(signedMessage.length).toBeGreaterThan(encryptedMessage.length);
  });
});