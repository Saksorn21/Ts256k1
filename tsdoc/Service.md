# Class Service

## interface

```typescript

interface DecodeSignMessage {
  signBytes: Uint8Array
  encryptMessage: Uint8Array
}

interface VerifyMessage {
  verify: boolean
  cipherText: Uint8Array
}

interface CompressionOptions {
  cacheDir: string
  listCacheFiles: () => string[]
  removeCacheFile: (filename: string) => void
  clearCache: () => void
}

```