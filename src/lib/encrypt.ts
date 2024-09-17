import {
  xchacha20,
  randomBytes,
  concatBytes,
  sha256,
  K1
} from '../utils'
import {
  ConstsType,
  isEphemeralKeyCompressed,
  signUseLowS
} from '../config'

import { PrivateKey } from './PrivateKey'
import { PublicKey } from './PublicKey'


/**
 * Encrypts a message using the given public key.
 *
 * @function _encrypt
 * @param {Uint8Array} key - The public key to use for encryption.
 * @param {Uint8Array} plainText - The message to encrypt.
 * @returns {Uint8Array} - The encrypted message, consisting of nonce, tag, and encrypted data concatenated together.
 */
function _encrypt(key: Uint8Array, plainText: Uint8Array): Uint8Array {
  // TODO: xchacha20poly1305 nonce 24 bytes
    const nonce: Uint8Array = randomBytes(
      ConstsType.XCHACHA20_NONCE_LENGTH
  );
    const cipher = xchacha20(key, nonce);
    const _b = new Uint8Array(
      plainText.length + 
      ConstsType.AEAD_TAG_LENGTH
  )
      _b.set(plainText, 0)
    const _s = _b.subarray(0, plainText.length)
    const ciphered = cipher.encrypt(_s,_b);
    const encrypted = ciphered
      .subarray(0, 
        ciphered.length - 
        ConstsType.AEAD_TAG_LENGTH
      );
    const tag = ciphered
      .subarray(
        ciphered.length - 
        ConstsType.AEAD_TAG_LENGTH
      );
  return concatBytes(nonce, tag, encrypted);
}

/**
 * Encrypts a message using the given public key.
 *
 * This function manages the conversion of the public key from its raw form (hexadecimal string or Uint8Array)
 * into a `PublicKey` instance. It then uses an ephemeral private key to encapsulate the public key and generate
 * a shared secret key. The message is encrypted with this shared secret key using XChaCha20-Poly1305 encryption.
 *
 * @function encrypt
 * @param {string | Uint8Array} k1RawPK - The public key to use for encryption, provided either as a hexadecimal string or as a Uint8Array.
 * @param {Uint8Array} msg - The message to encrypt.
 * @returns {Buffer} - The encrypted message, which includes the public key (compressed or uncompressed) and the encrypted data concatenated together.
 * 
 * @example
 * const publicKey = 'your-public-key-in-hex'; // Or Uint8Array
 * const message = utf8ToBytes('hello');
 * const encryptedMessage = encrypt(publicKey, message);
 * console.log(encryptedMessage.toString('hex'));
 */
export function encrypt(k1RawPK: Hex, msg: Uint8Array): Buffer {
  const temporaryStorageKey = new PrivateKey();

  const receiverPK = 
    k1RawPK instanceof Uint8Array
      ? new PublicKey(k1RawPK)
      : PublicKey.fromHex(k1RawPK);

  const xKey = temporaryStorageKey.encapsulate(receiverPK);
  const encrypted = _encrypt(xKey, msg);

  let pk: Uint8Array;
  
  //configuration (file: ts256k1.config.cjs
  if (isEphemeralKeyCompressed()) {
    pk = temporaryStorageKey.publicKey.compressed;
  } else {
    pk = temporaryStorageKey.publicKey.uncompressed;
  }

  // Convert the final result to a Buffer
  return Buffer.from(concatBytes(pk, encrypted));
}

/**
 * Creates a digital signature for the given encrypted data using the provided private key.
 * @function signMessage
 * @param {Uint8Array} encryptedData - The encrypted data to sign.
 * @param {string | Uint8Array} privateKey - The private key used for signing, provided either as a hexadecimal string or as a Uint8Array.
 * @returns {Buffer} - The generated signature in Buffer format.
 */
function signMessage(encryptedData: Uint8Array, privateKey: Hex): Buffer {
    const messageHash = sha256(encryptedData);
    const signature = K1.sign(messageHash, privateKey, {
        lowS: signUseLowS(),  //configuration (file: ts256k1.config.json))
        extraEntropy: new Uint8Array([10, 20, 30, 9]),
        prehash: false
    });

    // Convert the signature to a compact byte format and return it as a Buffer
    return Buffer.from(signature.toCompactRawBytes());
}

/**
 * Encodes the signed message by concatenating the signature and the encrypted message.
 * @function encodeSign
 * @param {Uint8Array} encryptedMessage - The encrypted message to be signed.
 * @param {string | Uint8Array} privateKey - The private key used to sign the message, either as a hex string or Uint8Array.
 * @returns {Buffer} - A Buffer containing both the signature and the encrypted message.
 */
export function encodeSign(encryptedMessage: Uint8Array, privateKey: Hex): Buffer {
    const createSignature = signMessage(encryptedMessage, privateKey);
    // Concatenate the signature and the encrypted message, returning it as a Buffer
    return Buffer.from(concatBytes(createSignature, encryptedMessage));
}
