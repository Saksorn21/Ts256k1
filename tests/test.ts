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
  bytesToUtf8,
  base64ToBytes,
  sha256,
  concatBytes,
  decodeHex,
} from '../src/utils/'
import {
  buildHuffmanTree,
  buildHuffmanCode,
  bitStringToUint8Array,
} from './test-tree'
import { isHkdfKeyCompressed } from '../src/config'
import { compressData } from '../src/utils/compression'
import { CompressionService as CompressionServiceAsync } from '../src/lib/CompressionServiceAsync'
import { CompressionService } from '../src/lib/CompressionService'
import { writeFileSync, readFileSync } from 'fs'
const text = utf8ToBytes('hello nyren')
const text1 = utf8ToBytes('saksorn tanaisak nyren')
const key = Ts256k1.getKeyPairs()
const piv = key.secretToHex
const pub = key.publicKey.toHex()
const ser = new Ts256k1(piv, pub)
const enc1 = ser.encrypt(text1)
const enc = ser.encrypt(text)

const cs = new CompressionService()
const enc2 = cs.compress(enc1, { coverage: null, level: 1 })
console.log(enc2)

//    raw: true,
//    windowBits: -15
//  })
//const wr = writeFileSync('test.txt', bytesToHex(enc2))
const datacompress =
  '02b2efabb7c078d2fae0aab6b68138486e0adab7beea9d56e2067cc930eaa09541973d442ee046b26e0a16686fd557574edd0445d8d432bf072c9d5e77297c2404ef9e479e0e1be75ad460fb368b47b16437510d6c71372002c6b5b766cfca3a09c9d6c7d0bf700d8bc1a3115b44a685e7a89439def7b3b0b9c9fb6177aa94e708379de24cc542500f712201c2351e65504ff3df3683f398c76ce906382f4e02192c5ca3960644cb82d67297e7e7b0513e3c8227'
const cpmen =
  '3665613062323332bb33b89cf389dbe54af4b190abbe75e11aa7e42d1c7b975c085f926dd5f97ce1c31333fc4d17b8582b7e894c9661697cb8edbf4953912d00'
const dedata = decodeHex(cpmen)
console.log(dedata, 'byhex', hexToBytes(cpmen))
const compreencrypt = ser.encryptAndCompress(text1, {
  coverage: 2,
})
console.log(compreencrypt)
//level:1,
//chunckSize:64,
//},enc1,enc, new Uint8Array(64))
//console.log('compress',enc2)
//const zlib = new CompressionService(false)
//const en = zlib.compressStream(enc,{
//coverage: 2,
// raw: true
//})

//const decrypt = ser.decrypt((de) as Uint8Array)
//console.log('decrypt',decrypt.toString(),decrypt)
//const decomp = decompressData(encomp, text.length)
