//import {Ts256k1} from '../dist/esm'
const tk = require('../dist/main')
const ne = tk.Ts256k1.getKeyPairs()
const secret = ne.secret
const pk = ne.publicKey.toHex()
console.log(secret, pk)