//import { bytesToHex } from '../src/utils/bytes';
import { Ts256k1, PrivateKey, PublicKey } from '../src/main'
import { encrypt, encodeSign } from '../src/lib/encrypt'
import { Service } from '../src/lib/Service'
import {
  randomBytes,
  utf8ToBytes,
  K1,
  hexToBytes,
  bytesToHex,
  bytesToBase64,
  base64ToBytes,
  sha256,
} from '../src/utils/'
import {
  buildHuffmanTree,
  buildHuffmanCode,
  bitStringToUint8Array,
} from './test-tree'
import { isHkdfKeyCompressed } from '../src/config'

const t = isHkdfKeyCompressed()
console.log(t)
let f = (isHkdfKeyCompressed() = false)
