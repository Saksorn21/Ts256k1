/**
 * @class Service
 * A class that handles encryption, decryption, and message signing/verification.
 */
export declare class Service {
    private readonly privateKeyA;
    private readonly publicKeyA;
    /**
     * @constructor
     * Initializes a new instance of the Service class.
     * @param {string | Uint8Array} privateKeyA - The private key used to sign and decrypt the message.
     * @param {string | Uint8Array} publicKeyA - The public key used to encrypt the message.
     */
    constructor(privateKeyA: Hex, publicKeyA: Hex);
    /**
     * Encrypts a message using the provided public key and signs the encrypted data using the private key.
     *
     * @param {Uint8Array} message - The message to be encrypted.
     * @returns {Buffer} - A Buffer containing the signed and encrypted message.
     */
    encrypt(message: Uint8Array): Buffer;
    /**
     * Decrypts a message and verifies its signature.
     *
     * @param {Uint8Array} messageEncrypt - The signed and encrypted message to be decrypted.
     * @returns {Buffer} - The decrypted message if the signature is valid.
     * @throws {Error} - Throws an error if the signature is invalid.
     */
    decrypt(messageEncrypt: Uint8Array): Buffer;
}
//# sourceMappingURL=Service.d.ts.map