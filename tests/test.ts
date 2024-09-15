import { bytesToHex } from '../src/utils/bytes';
import { Ts256k1 } from '../src/esm.mts';

const ts256k1 = Ts256k1.getKeyPairs()
const secret = ts256k1.secret
const publicKey = ts256k1.publicKey.compressed
console.log(secret)
console.log(bytesToHex(publicKey))

// const text = utils.utf8ToBytes('hello')
// const kk = new Ts256k1(Buffer.from(secret).toString('hex'), publicKey)
// const en = kk.encrypt(text)
// console.log(utils.bytesToBase64(en));
// const de = kk.decrypt(en)
// const encode = de.toString()
// console.log(utils.bytesToUtf8(de))
// console.log('hex',ts256k1.secretToHex)
