"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineKeys = combineKeys;
exports.getSharedKey = getSharedKey;
exports.hexToPublicKey = hexToPublicKey;
const index_1 = require("./index");
const config_1 = require("../config");
function combineKeys(master) { return (0, index_1.hkdf)(index_1.sha256, master, undefined, undefined, 32); }
function getSharedKey(ephemeralPoint, sharedPoint) { return combineKeys((0, index_1.concatBytes)(ephemeralPoint, sharedPoint)); }
function hexToPublicKey(hex) {
    const decoded = (0, index_1.decodeHex)(hex);
    if (decoded.length === config_1.ConstsType.ETH_PUBLIC_KEY_SIZE) {
        const fixed = new Uint8Array(1 + decoded.length);
        console.log(fixed);
        fixed.set([0x04]);
        fixed.set(decoded, 1);
        return fixed;
    }
    return decoded;
}
