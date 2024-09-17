import {
  K1,
  xchacha20,
  concatBytes,
  sha256
} from '../utils'
import { 
  ConstsType,
  isEphemeralKeyCompressed
} from '../config';

import { PrivateKey } from './PrivateKey';
import { PublicKey } from './PublicKey';

/**
 * @interface DecodedSignMessage
 * @property {Uint8Array} signBytes - The signature of the message.
 * @property {Uint8Array} encryptMessage - The encrypted message.
 */
export declare interface DecodedSignMessage{
  signBytes: Uint8Array,
  encryptMessage: Uint8Array
}

/**
 * @interface  VerifyMessage
 * @property {boolean} verify - The signature of the message.
 * @property {Uint8Array} cipherText - The encrypted message.
 */
export declare interface VerifyMessage{
  verify: boolean,
  cipherText: Uint8Array
}
/**
 * Decrypts a message using the given private key.
 * 
 * This function handles decryption by extracting the nonce, tag, and encrypted part from the cipher text.
 * It then uses the private key and XChaCha20 decryption to return the original plain text message.
 *
 * @function _decrypt
 * @param {Uint8Array} key - The private key to use for decryption.
 * @param {Uint8Array} cipherText - The message to decrypt, which includes nonce, tag, and encrypted data.
 * @returns {Uint8Array} - The decrypted message.
 */
function _decrypt(
  key: Uint8Array,
  cipherText: Uint8Array
): Uint8Array {
    const nonceTagLength = 
      ConstsType.XCHACHA20_NONCE_LENGTH + 
      ConstsType.AEAD_TAG_LENGTH;
    const nonce = cipherText
      .subarray(0, 
        ConstsType.XCHACHA20_NONCE_LENGTH
      );
    const tag = cipherText
      .subarray(
        ConstsType.XCHACHA20_NONCE_LENGTH, 
        nonceTagLength
      );
    const encrypted = cipherText.subarray(nonceTagLength);

    const decipher = xchacha20(key, Uint8Array.from(nonce)); // to reset byteOffset
    const ciphered = concatBytes(encrypted, tag);
    const _b = new Uint8Array(
      encrypted.length + 
      ConstsType.AEAD_TAG_LENGTH
    )
      _b.set(ciphered, 0)
    const _s = _b.subarray(0, encrypted.length)
  
  return decipher.decrypt(_b, _s);
}

/**
 * Decrypts a message using the given private key.
 * 
 * This function manages the conversion of the private key from its raw form (hexadecimal string or Uint8Array)
 * into a `PrivateKey` instance. It then extracts the public key from the message, decapsulates it to generate
 * the shared secret key, and decrypts the message using XChaCha20-Poly1305 decryption.
 *
 * @function decrypt
 * @param {string | Uint8Array} k1RawSK - The private key to use for decryption, provided either as a hexadecimal string or as a Uint8Array.
 * @param {Uint8Array} msg - The message to decrypt, which includes the public key and encrypted data.
 * @returns {Buffer} - The decrypted message.
 * 
 * @example
 * const privateKey = 'your-private-key-in-hex'; // Or Uint8Array
 * const encryptedMessage = Buffer.from('encrypted-data');
 * const decryptedMessage = decrypt(privateKey, encryptedMessage);
 * console.log(decryptedMessage.toString('utf8'));
 */
export function decrypt(k1RawSK: Hex, msg: Uint8Array): Buffer {
  const temporaryStorageKey =
    k1RawSK instanceof Uint8Array
      ? new PrivateKey(k1RawSK)
      : PrivateKey.fromHex(k1RawSK);

  const keySize: number = isCompressed();
  const senderPK: PublicKey = new PublicKey(msg.subarray(0, keySize));
  const encrypt = msg.subarray(keySize);
  const symKey = senderPK.decapsulate(temporaryStorageKey);
 // const decodedSign = verifyMessage(signBytes,symKey)
  //console.log(decodedSign)
  return Buffer.from(_decrypt(symKey, encrypt));
}

/**
 * Determines the size of the public key based on whether it is compressed or not.
 * 
 * This function checks if ephemeral key compression is enabled by calling `isEphemeralKeyCompressed`.
 * It then returns the size of the public key in bytes: either the compressed or uncompressed size.
 * 
 * @function isCompressed
 * @returns {number} - The size of the public key in bytes. Returns `COMPRESSED_PUBLIC_KEY_SIZE` if the key is compressed, 
 *                     otherwise returns `UNCOMPRESSED_PUBLIC_KEY_SIZE`.
 */
function isCompressed(): number {
  //configuration (file: ts256k1.config.json))
  return isEphemeralKeyCompressed() ? 
    ConstsType.COMPRESSED_PUBLIC_KEY_SIZE : ConstsType.UNCOMPRESSED_PUBLIC_KEY_SIZE;
}

/**
 * Decodes a signed and encrypted message to retrieve the signature and the encrypted data.
 * @function decodedSignMessage
 * @param {Uint8Array} encodedEncrypt - The signed and encrypted message.
 * @returns {DecodedSignMessage} - An object containing the signature and the encrypted message.
 */
export function decodedSignMessage(encodedEncrypt: Uint8Array): DecodedSignMessage {
    const sign = encodedEncrypt.subarray(0, ConstsType.SIGNATURE_SIZE);
    const encrypted = encodedEncrypt.subarray(ConstsType.SIGNATURE_SIZE);

    return {
        signBytes: sign,
        encryptMessage: encrypted
    };
}

/**
 * Verifies the signature of a signed message using the provided public key.
 * @function verifyMessage
 * @param {DecodedSignMessage} signatureRS - The decoded signature and encrypted message.
 * @param {string | Uint8Array} publicKey - The public key used to verify the signature, provided either as a hex string or Uint8Array.
 * @returns {VerifyMessage} - An object containing the verification result (boolean) and the original cipher text.
 */
export function verifyMessage(signatureRS: DecodedSignMessage, publicKey: Hex): VerifyMessage {
    const { signBytes, encryptMessage } = signatureRS;
    const encryptHex = sha256(encryptMessage);
    const verify = K1.verify(signBytes, encryptHex, publicKey);

    return {
        verify: verify,
        cipherText: encryptMessage
    };
}

