import { PrivateKey } from './lib/PrivateKey';
/**
 * @class Ts256k1 - A class for generating and managing 256-bit secret keys, and for encrypting and decrypting messages.
 * @example
 * const k1 = new Ts256k1(privateKey, publicKey);
 * const msg = utf8ToBytes('hello');
 * k1.decrypt(k1.encrypt(msg)).toString();
 *
 * @type {import('ts256k1').Ts256k1} Ts256k1
 */
export declare class Ts256k1 {
    private readonly secret;
    private readonly publicKey;
    /**
     * Generate a new secret key and public key pair.
     *
     * @static
     * @method getKeyPairs
     * @param {Uint8Array} [secret] - An optional secret key in Uint8Array format.
     * @returns {PrivateKey} - A new instance of PrivateKey.
     * @example
     * const k1 = Ts256k1.getKeyPairs();
     * const privateKey = k1.secretToHex();
     * const publicKey = k1.publicKey.toHex();
     * console.log(privateKey, publicKey);
     */
    static getKeyPairs(secret?: Uint8Array): PrivateKey;
    /**
     * Constructor for the Ts256k1 class.
     *
     * @param {string | Uint8Array} secret - The secret key in either hexadecimal string or Uint8Array format.
     * @param {string | Uint8Array} publicKey - The public key in either hexadecimal string or Uint8Array format.
     */
    constructor(secret: string | Uint8Array, publicKey: string | Uint8Array);
    /**
     * Encrypt a message using the public key.
     *
     * @method encrypt
     * @param {Uint8Array} msg - The message to be encrypted.
     * @returns {Uint8Array} - The encrypted message.
     */
    encrypt(msg: Uint8Array): Uint8Array;
    /**
     * Decrypt a message using the secret key.
     *
     * @method decrypt
     * @param {Uint8Array} msg - The encrypted message.
     * @returns {Uint8Array} - The decrypted message.
     */
    decrypt(msg: Uint8Array): Uint8Array;
}
//# sourceMappingURL=main.d.ts.map