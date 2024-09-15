# Ts256k1

**Ts256k1** is a TypeScript library for working with the `secp256k1` elliptic curve. It includes functionality for key generation, encryption, and decryption using `secp256k1` and the `xchacha20poly1305` algorithm.

## Installation

To install the library, you can use npm or yarn:

```bash
npm install ts256k1
```

or

```bash
yarn add ts256k1
```

## Usage

**Ts256k1** supports both `CommonJS` and `ES Module` formats. You can import the library in different ways depending on your module system.

### CommonJs

If you are using **CommonJS**, you can import Ts256k1 like this:

```javascript
const { Ts256k1 } = require('ts256k1');
const utils = require('ts256k1/utils')
```

### ES Modules

If you are using **ES Modules**, you can import Ts256k1 like this:

```typescript
import { Ts256k1 } from 'ts256k1';
import utils from 'ts256k1/utils'
```

### Generating Key Pairs

```typescript
import { Ts256k1 } from 'ts256k1';

// Generate a new key pair
const keyPair = Ts256k1.getKeyPairs();
const privateKey = keyPair.secretToHex; // keyPair.secret output Uint8Array
const publicKey = keyPair.publicKey.toHex();

console.log(`Private Key: ${privateKey}`);
console.log(`Public Key: ${publicKey}`);
```

### Encrypting and Decrypting Messages

```typescript
import { Ts256k1 } from 'ts256k1';
import { utf8ToBytes, bytesToUtf8 } from 'ts256k1/utils';

// Create a Ts256k1 instance with your keys
const ts256k1 = new Ts256k1(privateKey, publicKey);

// Encrypt a message
const message = utf8ToBytes('hello, Ts256k1');
const encryptedMessage = ts256k1.encrypt(message);

// Decrypt the message
const decryptedMessage = ts256k1.decrypt(encryptedMessage);
console.log(`Decrypted Message: ${bytesToUtf8(decryptedMessage)}`);
```

## Utilities

The library provides various utilities for encoding and decoding:

- `bytesToHex(bytes: Uint8Array): string`
- `hexToBytes(hex: string): Uint8Array`
- `bytesToUtf8(bytes: Uint8Array): string`
- `utf8ToBytes(utf8: string): Uint8Array`
- `bytesToBase64(bytes: Uint8Array): string`
- `base64ToBytes(base64: string): Uint8Array`
- `bytesToAscii(bytes: Uint8Array): string`
- `asciiToBytes(ascii: string): Uint8Array`
- `bytesToLatin1(bytes: Uint8Array): string`
- `latin1ToBytes(latin1: string): Uint8Array`
- `bytesToUcs2(bytes: Uint8Array): string`
- `ucs2ToBytes(ucs2: string): Uint8Array`
- `remove0x(hex: string): string`
- `decodeHex(hex: string): Uint8Array`

## Configuration

Configuration is managed via a JSON file (`ts256k1.config.json`). The settings you can configure are:

- `hkdfKeyCompressed`: Boolean indicating if the HKDF key should be compressed.
- `ephemeralKeyCompressed`: Boolean indicating if the ephemeral key should be compressed.

Example configuration file (`ts256k1.config.json`):

```json
{
  "hkdfKeyCompressed": false,
  "ephemeralKeyCompressed": false
}
```

## API

### Class: `Ts256k1`

Provides encryption and decryption functionality.

- `static getKeyPairs(secret?: Uint8Array): PrivateKey`
- `constructor(secret: string | Uint8Array, publicKey: string | Uint8Array)`
- `encrypt(msg: Uint8Array): Uint8Array`
- `decrypt(msg: Uint8Array): Uint8Array`

### Class: `PublicKey`

Represents a public key.

- `static fromHex(hex: string): PublicKey`
- `get compressed(): Buffer`
- `get uncompressed(): Buffer`
- `toHex(compressed: boolean = true): string`

### Class: `PrivateKey`

Represents a private key.

- `static fromHex(hex: string): PrivateKey`
- `get secret(): Uint8Array`
- `get secretToHex(): string`
- `readonly publicKey: PublicKey`
- `encapsulate(pk: PublicKey): Uint8Array`
- `multiply(pk: PublicKey, compressed: boolean = false): Uint8Array`

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgement

This project uses portions of code from [`eciesjs`](https://github.com/ecies/js), which is licensed under the MIT License.

Copyright (c) 2019-2024 Weiliang Li
