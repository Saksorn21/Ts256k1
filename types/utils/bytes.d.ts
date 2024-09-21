type Title = 'base64' | 'hex' | 'utf8' | 'ascii' | 'ucs2' | 'latin1' | 'Title';
export declare const bytesToHex: (msg: Uint8Array) => string;
export declare const hexToBytes: (msg: string) => Uint8Array;
export declare const bytesToUtf8: (msg: Uint8Array) => string;
export declare const utf8ToBytes: (msg: string) => Uint8Array;
export declare const bytesToBase64: (bytes: Uint8Array) => string;
export declare const base64ToBytes: (base64: string) => Buffer;
export declare const bytesToAscii: (bytes: Uint8Array) => string;
export declare const asciiToBytes: (ascii: string) => Buffer;
export declare const bytesToLatin1: (bytes: Uint8Array) => string;
export declare const latin1ToBytes: (latin1: string) => Buffer;
export declare const bytesToUcs2: (bytes: Uint8Array) => string;
export declare const ucs2ToBytes: (ucs2: string) => Buffer;
export declare const remove0x: (hex: string) => string;
export declare const decodeHex: (hex: string) => Uint8Array;
export declare function isBytes(a: unknown): a is Uint8Array | Buffer;
export declare function abytes(item: unknown): void;
export declare function isString(title: Title, mgs: unknown): void;
/**
 * Ensures the input is a Uint8Array. Converts from hex if the input is a string.
 *
 * @function normalizeToUint8Array
 * @param {Hex} data - The data to normalize, either a Uint8Array or a hex string.
 * @returns {Uint8Array} - The normalized Uint8Array.
 */
export declare function normalizeToUint8Array(data: Hex): Uint8Array;
export {};
//# sourceMappingURL=bytes.d.ts.map