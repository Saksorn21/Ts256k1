# nyren-ts256k1

**nyren-ts256k1** is a TypeScript library for working with the `secp256k1` elliptic curve. It includes functionality for key generation, encryption, decryption, signing, and signature verification using `secp256k1` and the `xchacha20poly1305` algorithm.

## Installation

To install the library, you can use npm or bun or yarn:

```bash
npm i @nyren/ts256k1
or
bun add @nyren/ts256k1
or
yarn add @nyren/ts256k1
```

## Usage

**nyren-ts256k1** supports both `CommonJS` and `ES Module` formats. You can import the library in different ways depending on your module system.

### CommonJs

If you are using **CommonJS**, you can import Ts256k1 like this:

```javascript
const { Ts256k1 } = require('@nyren/ts256k1');

```

### ES Modules

If you are using **ES Modules**, you can import Ts256k1 like this:

```typescript
import { Ts256k1 } from '@nyren/ts256k1';

```

### Generating Key Pairs

```typescript
import { Ts256k1 } from '@nyren/ts256k1';

// Generate a new key pair
const keyPair = Ts256k1.getKeyPairs();
const privateKey = keyPair.secretToHex; // keyPair.secret output Uint8Array
const publicKey = keyPair.publicKey.toHex();

console.log(`Private Key: ${privateKey}`);
console.log(`Public Key: ${publicKey}`);
```

### Encrypting and Decrypting Messages

```typescript
import { Ts256k1 } from '@nyren/ts256k1';
import { utf8ToBytes, bytesToUtf8 } from '@nyren/ts256k1/utils';

// Create a Ts256k1 instance with your keys
const ts256k1 = new Ts256k1(privateKey, publicKey);

// Encrypt a message
const message = utf8ToBytes('hello, Ts256k1');
const encryptedMessage = ts256k1.encrypt(message);

// Decrypt the message
const decryptedMessage = ts256k1.decrypt(encryptedMessage); // return Uint8Array
console.log(`Decrypted Message: ${bytesToUtf8(decryptedMessage)}`);
```
### Utils bytes

```typescript
import { bytesToBase64, base64ToBytes } from '@nyren/ts256k1/utils'
const encryptMessage = new Uint8Array[1,2,3,4]
const toBase64 = bytesToBase64(encryptMassage)
const base64To = base64ToBytes(toBase64)
// return Buffer If you want Uint8Array 'Uint8Array.from(base64To)': Uint8Array

```

## All imports
```typescript
import { Ts256k1, PrivateKey, PublicKey } from '@nyren/ts256k1'
import { Service, encrypt, encodeSing, decrypt, decodeSignMessage, verifyMessage } from '@nyren/ts256k1/service'
//TODO: Data conversion, see below
import utils from '@nyren/ts256k1/utils'

```

## Utilities

The library provides various utilities for encoding and decoding:

- `bytesToHex(bytes: Uint8Array): string`
- `hexToBytes(hex: string): Uint8Array`
- `bytesToUtf8(bytes: Uint8Array): string`
- `utf8ToBytes(utf8: string): Uint8Array`
- `bytesToBase64(bytes: Uint8Array): string`
- `base64ToBytes(base64: string): Buffer`
- `bytesToAscii(bytes: Uint8Array): string`
- `asciiToBytes(ascii: string): Buffer`
- `bytesToLatin1(bytes: Buffer): string`
- `latin1ToBytes(latin1: string): Buffer`
- `bytesToUcs2(bytes: Uint8Array): string`
- `ucs2ToBytes(ucs2: string): Buffer`
- `remove0x(hex: string): string`
- `decodeHex(hex: string): Buffer`
- `normalizeToUint8Array(data: string | Uint8array): Uint8Array`


## Configuration

Configuration files must be written in CommonJS format and saved as `.cjs`. This ensures compatibility with the library's CommonJS format. The settings you can configure are:

- `hkdfKeyCompressed`: A boolean that indicates if the HKDF key should be compressed. (Default: false)
- `ephemeralKeyCompressed`: A boolean that indicates if the ephemeral key should be compressed. (Default: false)
- `signature`: An object that contains signature options:
  - `enabled`: A boolean that indicates whether signature functionality is enabled. (Default: true)
  - `throwOnInvalid`: A boolean that indicates whether an error should be thrown if the signature is invalid. (Default: true)
  - `errorMessage`: A string specifying the error message to be thrown if the signature is invalid. (Default: "Invalid signature")
  - `useLowS`: A boolean that indicates whether the signature should use low S. (Default: true)

Example configuration file (`ts256k1.config.cjs`):

```JavaScript
module.exports = {
  hkdfKeyCompressed: false, 
  ephemeralKeyCompressed: false,
  signature: {
    enabled: true,
    throwOnInvalid: true,
    errorMessage: 'Invalid signature',
    useLowS: true
  }
}
```

#### Note:
- On **`ephemeralKeyCompressed = true`**, the payload would be: `33 Bytes + Ciphered` instead of `65 Bytes + Ciphered`.

- On **`hkdfKeyCompressed = true`**, the hkdf key would be derived from `ephemeral public key (compressed) + shared public key (compressed)` instead of `ephemeral public key (uncompressed) + shared public key (uncompressed)`.

## API

### Class: **Ts256k1**

The **Ts256k1** class is a simplified interface for generating and managing key pairs, as well as encrypting and decrypting messages. This class extends the functionality of the `Service` class, inheriting all of its encryption and decryption capabilities.

- **Inheritance**: `Ts256k1` extends `Service`, which means all methods available in `Service` (like `encrypt`, `decrypt`, and `equals`) are also available in `Ts256k1`.

#### Methods:
- `static getKeyPairs(secret?: Uint8Array): PrivateKey`
  - Generates a new private and public key pair.
  - **Parameters**: 
    - `secret` _(optional)_: An optional 32-byte `Uint8Array` secret key.
  - **Returns**: `PrivateKey` instance.
  
- `constructor(secret: string | Uint8Array, publicKey: string | Uint8Array)`
  - Creates an instance of `Ts256k1` with a specified private and public key.

#### Note:
- For more details on encryption, decryption, and key comparison methods, refer to the **Service** class documentation.

### Class: **PublicKey**

This class represents a public key.

- `static fromHex(hex: string): PublicKey` — Creates a public key from a hexadecimal string.
- `get compressed(): Buffer` — Returns the compressed form of the public key.
- `get uncompressed(): Buffer` — Returns the uncompressed form of the public key.
- `toHex(compressed: boolean = true): string` — Returns the public key as a hexadecimal string, either compressed or uncompressed.

### Class: **PrivateKey**

This class represents a private key.

- `static fromHex(hex: string): PrivateKey` — Creates a private key from a hexadecimal string.
- `get secret(): Uint8Array` — Returns the private key in Uint8Array format.
- `get secretToHex(): string` — Returns the private key as a hexadecimal string.
- `readonly publicKey: PublicKey` — Returns the associated public key for this private key.
- `encapsulate(pk: PublicKey): Uint8Array` — Encapsulates a public key to generate a shared secret.
- `multiply(pk: PublicKey, compressed: boolean = false): Uint8Array` — Multiplies the private key with the public key and returns the result.

### Class: **Service**

This class handles encryption, decryption, and message signing/verification.

- `constructor(privateKeyA: string | Uint8Array, publicKeyA: string | Uint8Array)` — Initializes the service with a private and public key.
- `encrypt(msg: Uint8Array): Uint8Array` — Encrypts the provided message and signs it if signature functionality is enabled.
- `decrypt(msg: Uint8Array): Uint8Array` — Decrypts the provided message and verifies its signature if enabled.
- `encryptAndCompress(msg: Uint8Array): Uint8Array` — Encrypts the provided message and signs it if signature functionality is enabled.
- `decryptAndDecompress(msg: Uint8Array): Uint8Array` — Decrypts the provided message and verifies its signature if enabled.
- `equals(other: PrivateKey | PublicKey): boolean` - Compares this key with another PrivateKey or PublicKey instance.

### Function color
- color[color: string]: string
- color[color: string].bold: string
#### Support color

## Message Signing and Verification

Our encryption process includes an additional layer of security by signing the encrypted data using the sender’s private key. When decrypting, the signature is verified using the sender’s public key to ensure the data has not been tampered with. This ensures both message integrity and authenticity.

## About

`Ts256k1` is a lightweight and secure library built on top of the [Noble](https://github.com/paulmillr/noble) cryptography libraries. It focuses on providing a pure TypeScript implementation for working with the secp256k1 elliptic curve. The core cryptographic functions in `Ts256k1` are based on the high-security primitives provided by Noble libraries:

- [@noble/ciphers](https://github.com/paulmillr/noble-ciphers)
- [@noble/curves](https://github.com/paulmillr/noble-curves)
- [@noble/hashes](https://github.com/paulmillr/noble-hashes)

These libraries are designed with performance and security in mind, following best practices for elliptic curve cryptography and encryption schemes like `xchacha20poly1305`. Noble libraries are written in TypeScript, ensuring type safety and reducing the potential for vulnerabilities often introduced by low-level languages or complex native dependencies.

## Security

`Ts256k1` inherits its cryptographic strength from the Noble libraries, which implement safe and audited cryptographic algorithms. Here's why you can trust this library:

- **Pure TypeScript**: No native dependencies, which reduces the risk of supply chain attacks or vulnerabilities introduced by compiled code.
- **Well-audited algorithms**: Noble libraries follow modern cryptographic standards and practices, making use of secure, constant-time operations to prevent timing attacks.
- **Elliptic Curve Cryptography (ECC)**: Uses the widely recognized secp256k1 curve, the same curve used in Bitcoin and other blockchain technologies, which is known for its strong security properties.
- **Encryption**: The library uses XChaCha20-Poly1305 for encryption, a secure AEAD (Authenticated Encryption with Associated Data) cipher that provides both confidentiality and integrity.

We encourage all users to follow best security practices when handling private keys and sensitive information. Always validate your inputs and keep your dependencies up to date to benefit from the latest security patches.

## Changelog

See [CHANGELOG](CHANGELOG.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgement

This project uses portions of code from [`eciesjs`](https://github.com/ecies/js), which is licensed under the MIT License.

Copyright (c) 2019-2024 Weiliang Li
