# Class CompressionService
## type

```typescript
type CompressOpts = DeflateOptions & {
  coverage: 1 | 2 | 3 | 4 | null
}
```
## interface

```typescript
interface CacheEntry {
  PREFIXUUID: string
  totalSize: number
  dataStorage: Uint8Array
}
```
