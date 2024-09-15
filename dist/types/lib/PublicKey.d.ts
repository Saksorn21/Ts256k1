import { PrivateKey } from './PrivateKey';
/**
 * @class PublicKey - A class that represents a public key.
 */
export declare class PublicKey {
    /**
     * Create a new instance of PublicKey from a hexadecimal string.
     *
     * @static
     * @method fromHex
     * @param {string} hex - The hexadecimal string representing the public key.
     * @returns {PublicKey} - A new instance of PublicKey.
     */
    static fromHex(hex: string): PublicKey;
    private readonly data;
    /**
     * @property {Uint8Array} compressed - The compressed public key.
     * @property {Uint8Array} uncompressed - The uncompressed public key.
     */
    get compressed(): Buffer;
    get uncompressed(): Buffer;
    /**
     * @constructor
     * @param {Uint8Array} data - The public key data in Uint8Array format.
     */
    constructor(data: Uint8Array);
    /**
     * Converts the public key to a hexadecimal string.
     *
     * @method toHex
     * @param {boolean} [compressed=true] - Whether to return the compressed or uncompressed public key.
     * @returns {string} - The hexadecimal representation of the public key.
     */
    toHex(compressed?: boolean): string;
    /**
     * Derives a shared secret using the private key and the current public key.
     *
     * @method decapsulate
     * @param {PrivateKey} sk - The private key used to decapsulate (derive shared secret).
     * @returns {Uint8Array} - The derived shared secret in byte array format.
     */
    decapsulate(sk: PrivateKey): Uint8Array;
    /**
     * Converts the public key to the specified format (compressed or uncompressed).
     *
     * @method convertPublicKeyFormat
     * @param {Uint8Array} pk - The public key to be converted.
     * @param {boolean} compressed - Whether to convert to the compressed format.
     * @returns {Uint8Array} - The converted public key.
     * @private
     */
    private convertPublicKeyFormat;
}
//# sourceMappingURL=PublicKey.d.ts.map