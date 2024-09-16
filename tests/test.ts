//import { bytesToHex } from '../src/utils/bytes';
import { Ts256k1 } from '../src/main';
import {encrypt, encodeSign} from '../src/lib/encrypt'
import { Service } from '../src/lib/Service'
import {utf8ToBytes, K1, sha256} from '../src/utils/'
const ts256k1 = Ts256k1.getKeyPairs()
const text = utf8ToBytes('hello')
const secret = ts256k1.secret
const publicKey = ts256k1.publicKey.toHex()
const ser = new Service(secret, publicKey)
const encrypted = ser.decrypt(ser.encrypt(text))
console.log(ts256k1.publicKey.compressed)

console.log(encrypted.toString('hex'))
const sk = ts256k1.encapsulate(ts256k1.publicKey)
console.log(sk)
const some = sk.slice(2)
console.log(some)
const m = 'hioiiii'
const g = sha256(m);
  const signature = K1.sign(g, secret, {
      lowS: false,  //configuration (file: ts256k1.config.json))
      extraEntropy: true,
      prehash: false
  });
let sig = K1.Signature.fromCompact(signature.toCompactHex())
sig=sig.addRecoveryBit(1)
sig= sig.recoverPublicKey(g).toRawBytes()
console.log(sig);