import {
  bytesToHex as toHex,
  hexToBytes as toBytse,
  bytesToUtf8 as toUtf8,
  utf8ToBytes as u8ToBytes,
  concatBytes,
} from './noble'
type Title = 'base64' | 'hex' | 'utf8' | 'ascii' | 'ucs2' | 'latin1' | 'Title'
export const bytesToHex = (msg: Uint8Array): string => toHex(msg)
export const hexToBytes = (msg: string): Uint8Array => toBytse(msg)
export const bytesToUtf8 = (msg: Uint8Array): string => toUtf8(msg)
export const utf8ToBytes = (msg: string): Uint8Array => u8ToBytes(msg)

//TODO: All returns Buffer to Uint8Array
export const bytesToBase64 = (bytes: Uint8Array): string => {
  abytes(bytes)
  return Buffer.from(bytes).toString('base64')
}
export const base64ToBytes = (base64: string): Buffer => {
  isString('base64', base64)
  return Buffer.from(base64, 'base64')
}
export const bytesToAscii = (bytes: Uint8Array): string => {
  abytes(bytes)
  return Buffer.from(bytes).toString('ascii')
}
export const asciiToBytes = (ascii: string): Buffer => {
  isString('ascii', ascii)
  return Buffer.from(ascii, 'ascii')
}
export const bytesToLatin1 = (bytes: Uint8Array): string => {
  abytes(bytes)
  return Buffer.from(bytes).toString('latin1')
}
export const latin1ToBytes = (latin1: string): Buffer => {
  isString('latin1', latin1)
  return Buffer.from(latin1, 'latin1')
}
export const bytesToUcs2 = (bytes: Uint8Array): string => {
  abytes(bytes)
  return Buffer.from(bytes).toString('ucs2')
}
export const ucs2ToBytes = (ucs2: string): Buffer => {
  isString('ucs2', ucs2)
  return Buffer.from(ucs2, 'ucs2')
}

export const remove0x = (hex: string): string => {
  isString('hex', hex)

  return hex.startsWith('0x') || hex.startsWith('0X') ? hex.slice(2) : hex
}
export const decodeHex = (hex: string): Uint8Array => hexToBytes(remove0x(hex))

export function isBytes(a: unknown): a is Uint8Array | Buffer {
  return (
    a instanceof Uint8Array ||
    a instanceof Buffer ||
    (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array')
  )
}

export function abytes(item: unknown): void {
  if (!isBytes(item))
    throw new TypeError(`Expected Uint8Array or Buffer, got ${typeof item}`)
}
export function isString(title: Title, mgs: unknown): void {
  if (typeof mgs !== 'string')
    throw new TypeError(title + ' string expected, got ' + typeof mgs)
}
/**
 * Ensures the input is a Uint8Array. Converts from hex if the input is a string.
 *
 * @function normalizeToUint8Array
 * @param {Hex} data - The data to normalize, either a Uint8Array or a hex string.
 * @returns {Uint8Array} - The normalized Uint8Array.
 */
export function normalizeToUint8Array(data: Hex): Uint8Array {
  if (!isBytes(data)) {
    return hexToBytes(data)
  }
  return data
}

const utils = {
  bytesToHex,
  hexToBytes,
  bytesToUtf8,
  utf8ToBytes,
  bytesToBase64,
  base64ToBytes,
  bytesToAscii,
  asciiToBytes,
  bytesToLatin1,
  latin1ToBytes,
  bytesToUcs2,
  ucs2ToBytes,
  remove0x,
  decodeHex,
  isBytes,
  abytes,
  isString,
  normalizeToUint8Array,
}
export { concatBytes }
export default utils
