"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const encrypt_1 = require("./encrypt");
const decrypt_1 = require("./decrypt");
const config_1 = require("../config");
/**
 * @class Service
 * A class that handles encryption, decryption, and message signing/verification.
 */
class Service {
    /**
     * @constructor
     * Initializes a new instance of the Service class.
     * @param {string | Uint8Array} privateKeyA - The private key used to sign and decrypt the message.
     * @param {string | Uint8Array} publicKeyA - The public key used to encrypt the message.
     */
    constructor(privateKeyA, publicKeyA) {
        Object.defineProperty(this, "privateKeyA", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: privateKeyA
        });
        Object.defineProperty(this, "publicKeyA", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: publicKeyA
        });
    }
    /**
     * Encrypts a message using the provided public key and signs the encrypted data using the private key.
     *
     * @param {Uint8Array} message - The message to be encrypted.
     * @returns {Buffer} - A Buffer containing the signed and encrypted message.
     */
    encrypt(message) {
        // Encrypt the message using the public key
        const dataEncrypted = (0, encrypt_1.encrypt)(this.publicKeyA, message);
        // Sign the encrypted message using the private key
        const encodeSignMessage = (0, encrypt_1.encodeSign)(dataEncrypted, this.privateKeyA);
        return encodeSignMessage;
    }
    /**
     * Decrypts a message and verifies its signature.
     *
     * @param {Uint8Array} messageEncrypt - The signed and encrypted message to be decrypted.
     * @returns {Buffer} - The decrypted message if the signature is valid.
     * @throws {Error} - Throws an error if the signature is invalid.
     */
    decrypt(messageEncrypt) {
        // Decode the signed and encrypted message, then verify the signature
        const { verify, cipherText } = (0, decrypt_1.verifyMessage)((0, decrypt_1.decodedSignMessage)(messageEncrypt), this.publicKeyA);
        // If the signature is not valid, throw an error
        if (!verify)
            throw new Error((0, config_1.signThrowMessage)());
        // If the signature is valid, decrypt the cipher text using the private key
        return (0, decrypt_1.decrypt)(this.privateKeyA, cipherText);
    }
}
exports.Service = Service;
