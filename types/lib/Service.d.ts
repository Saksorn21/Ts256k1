import { encrypt, encodeSign } from './encrypt';
import { decrypt, verifyMessage, decodeSignMessage } from './decrypt';
import { PrivateKey } from './PrivateKey';
import { PublicKey } from './PublicKey';
/**
 * @class Service
 * A class that handles encryption, decryption, and message signing/verification.
 */
export declare class Service {
    private readonly privateKeyA;
    private readonly publicKeyA;
    /**
     * Initializes a new instance of the Service class.
     *
     * @constructor
     * @param {string | Uint8Array} privateKeyA - The private key used for signing and decrypting messages.
     * @param {string | Uint8Array} publicKeyA - The public key used for encrypting messages.
     */
    constructor(privateKeyA: Hex, publicKeyA: Hex);
    /**
     * Encrypts a message using the provided public key, and signs the encrypted data using the private key
     * if signature signing is enabled.
     *
     * @param {Uint8Array} message - The plaintext message to be encrypted.
     * @returns {Buffer} - A Buffer containing the signed and encrypted message, or just the encrypted message
     *                     if signing is disabled.
     */
    encrypt(message: Uint8Array): Buffer;
    /**
     * Decrypts a signed and encrypted message, and verifies its signature if signing is enabled.
     *
     * @param {Uint8Array} messageEncrypt - The signed and encrypted message to be decrypted.
     * @returns {Buffer} - The decrypted plaintext message if the signature is valid or if signing is disabled.
     * @throws {Error} - Throws an error if the signature is invalid and `throwOnInvalid` is set to true.
     */
    decrypt(messageEncrypt: Uint8Array): Buffer;
    /**
     * Compares this key with another PrivateKey or PublicKey instance.
     * Converts the current key to a Uint8Array if it is in hex format.
     * If the current publicKeyA is compressed, it compares it with the compressed version of the other PublicKey.
     * Otherwise, it compares with the uncompressed version.
     *
     * @method equals
     * @param {PrivateKey | PublicKey} other - The PrivateKey or PublicKey instance to compare with.
     * @returns {boolean} - Returns true if the two instances are equal, false otherwise.
     * @throws {TypeError} - Throws an error if `other` is neither a PrivateKey nor a PublicKey instance.
     */
    equals(other: PrivateKey | PublicKey): boolean;
}
export { encrypt, encodeSign, decrypt, decodeSignMessage, verifyMessage };
//# sourceMappingURL=Service.d.ts.map