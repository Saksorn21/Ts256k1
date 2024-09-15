"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeHex = exports.remove0x = exports.ucs2ToBytes = exports.bytesToUcs2 = exports.latin1ToBytes = exports.bytesToLatin1 = exports.asciiToBytes = exports.bytesToAscii = exports.base64ToBytes = exports.bytesToBase64 = exports.utf8ToBytes = exports.bytesToUtf8 = exports.hexToBytes = exports.bytesToHex = void 0;
const noble_1 = require("./noble");
const bytesToHex = (msg) => (0, noble_1.bytesToHex)(msg);
exports.bytesToHex = bytesToHex;
const hexToBytes = (msg) => (0, noble_1.hexToBytes)(msg);
exports.hexToBytes = hexToBytes;
const bytesToUtf8 = (msg) => (0, noble_1.bytesToUtf8)(msg);
exports.bytesToUtf8 = bytesToUtf8;
const utf8ToBytes = (msg) => (0, noble_1.utf8ToBytes)(msg);
exports.utf8ToBytes = utf8ToBytes;
//TODO: All returns Buffer to Uint8Array
const bytesToBase64 = (bytes) => {
    abytes(bytes);
    return Buffer.from(bytes).toString('base64');
};
exports.bytesToBase64 = bytesToBase64;
const base64ToBytes = (base64) => {
    isString('base64', base64);
    return Buffer.from(base64, 'base64');
};
exports.base64ToBytes = base64ToBytes;
const bytesToAscii = (bytes) => {
    abytes(bytes);
    return Buffer.from(bytes).toString('ascii');
};
exports.bytesToAscii = bytesToAscii;
const asciiToBytes = (ascii) => {
    isString('ascii', ascii);
    return Buffer.from(ascii, 'ascii');
};
exports.asciiToBytes = asciiToBytes;
const bytesToLatin1 = (bytes) => {
    abytes(bytes);
    return Buffer.from(bytes).toString('latin1');
};
exports.bytesToLatin1 = bytesToLatin1;
const latin1ToBytes = (latin1) => {
    isString('latin1', latin1);
    return Buffer.from(latin1, 'latin1');
};
exports.latin1ToBytes = latin1ToBytes;
const bytesToUcs2 = (bytes) => {
    abytes(bytes);
    return Buffer.from(bytes).toString('ucs2');
};
exports.bytesToUcs2 = bytesToUcs2;
const ucs2ToBytes = (ucs2) => {
    isString('ucs2', ucs2);
    return Buffer.from(ucs2, 'ucs2');
};
exports.ucs2ToBytes = ucs2ToBytes;
const remove0x = (hex) => {
    isString('hex', hex);
    return hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
};
exports.remove0x = remove0x;
const decodeHex = (hex) => (0, exports.hexToBytes)((0, exports.remove0x)(hex));
exports.decodeHex = decodeHex;
function isBytes(a) {
    return (a instanceof Uint8Array || (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
function abytes(item) {
    if (!isBytes(item))
        throw new Error('Uint8Array expected');
}
function isString(title, mgs) {
    if (typeof mgs !== 'string')
        throw new Error(title + ' string expected, got ' + typeof mgs);
}
