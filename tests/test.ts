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

const datacompress =
  '02b2efabb7c078d2fae0aab6b68138486e0adab7beea9d56e2067cc930eaa09541973d442ee046b26e0a16686fd557574edd0445d8d432bf072c9d5e77297c2404ef9e479e0e1be75ad460fb368b47b16437510d6c71372002c6b5b766cfca3a09c9d6c7d0bf700d8bc1a3115b44a685e7a89439def7b3b0b9c9fb6177aa94e708379de24cc542500f712201c2351e65504ff3df3683f398c76ce906382f4e02192c5ca3960644cb82d67297e7e7b0513e3c8227'
const cpmen =
  '3665613062323332bb33b89cf389dbe54af4b190abbe75e11aa7e42d1c7b975c085f926dd5f97ce1c31333fc4d17b8582b7e894c9661697cb8edbf4953912d00'
import { WriteStream } from 'tty'
import p, { reset } from '../src/utils/color'
//process.env.NODE_DISABLE_COLORS = 2
const o = p.color.red.bold(`hello${reset.style}${p.color.blue(`nyren`)}`)
console.log(`${reset.style}${o} world`)
if (
  process.stdout instanceof WriteStream &&
  typeof process.stdout.getColorDepth === 'function'
) {
  console.log(process.stdout.getColorDepth())
}
import { File } from 'buffer'
const file = new File(['./cache'], '0e8f1e3d_191.bin', { type: 'bin' })
const arr = new TextEncoder().encode('hello nyren')
console.log(file, arr)
const de = new TextDecoder().decode(arr)
console.log(de)
//console.log(process.stdout.getColorDepth)
