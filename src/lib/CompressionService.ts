import {
  compressData,
  decompressData,
  calculateChunkSize,
  type CompressOpts,
  type InflateOptions,
  type DeflateOptions,
} from '../utils/compression'
import {
  writeFileBit,
  listCacheFiles,
  removeCacheFile,
  analyzeFiles,
  setCacheDirectory,
  UUID,
  type RawPreload,
} from '../utils/handlersFiles'
import { ConstsType } from '../config'
import { concatBytes, bytesToUtf8, utf8ToBytes } from '../utils/'
export interface CacheEntry {
  PREFIXUUID: string
  totalSize: number
  dataStorage: Uint8Array
}

export class CompressionService {
  private cache = new Map<string, CacheEntry>()
  static extractDictionary(
    data: Uint8Array,
    coverage: CompressOpts['coverage'] = 2
  ): Uint8Array {
    //Split the data length into 4 parts.
    const quarter = data.length / 4
    const coverageFactor = coverage ?? 2
    const end = Math.round(quarter * coverageFactor)

    return data.subarray(0, end)
  }
  constructor(useTemp: boolean = false) {
    setCacheDirectory(useTemp)

    this.preloadAllCacheFiles(this.cacheDir)
  }
  private preloadOneCacheFile(
    prefix: string,
    cache: Map<string, CacheEntry>
  ): void {
    const raw = analyzeFiles(this.cacheDir, utf8ToBytes(prefix))[prefix]
    cache.set(prefix, {
      PREFIXUUID: prefix,
      totalSize: raw.totalSize,
      dataStorage: raw.dataStorage,
    })
  }
  private preloadAllCacheFiles(dir: string): void {
    for (const [key, value] of Object.entries(analyzeFiles(dir))) {
      const { prefix, totalSize, dataStorage } =
        value as RawPreload[keyof RawPreload]
      this.cache.set(key, {
        PREFIXUUID: prefix,
        totalSize: totalSize,
        dataStorage: dataStorage,
      } as CacheEntry)
    }
  }
  get UUID() {
    return UUID()
  }
  get cacheDir() {
    return globalThis.CACHE_DIR
  }
  public compress(data: Uint8Array, options: CompressOpts) {
    const dictionary = CompressionService.extractDictionary(
      data,
      options.coverage
    )
    const { totalSize } = calculateChunkSize([data], data.length)
    const prefixUUID = writeFileBit(
      dictionary,
      this.cacheDir,
      this.UUID,
      totalSize
    )
    delete options.coverage

    const compressedData = compressData(
      dictionary,
      {
        chunkSize: totalSize,
        ...options,
      },
      data
    ) // Compress data
    return concatBytes(prefixUUID, compressedData)
  }
  public decompress(data: Uint8Array, options?: InflateOptions): Uint8Array {
    const prefix = bytesToUtf8(
      data.subarray(0, ConstsType.PREFIX_COMPRESS_LENGTH)
    )

    if (this.cache.has(prefix) === undefined) {
      this.preloadOneCacheFile(prefix, this.cache)
    }

    const { PREFIXUUID, totalSize, dataStorage } = this.cache.get(
      prefix
    ) as CacheEntry

    if (prefix !== PREFIXUUID) {
      throw new Error(`Prefix not match ${prefix}, got ${PREFIXUUID}`)
    }
    const decompressedData = decompressData(
      data.subarray(ConstsType.PREFIX_COMPRESS_LENGTH),
      {
        chunkSize: totalSize,
        dictionary: dataStorage,
        ...options,
      }
    )
    return decompressedData
  }
  public compressSync(
    options: DeflateOptions,
    ...data: Uint8Array[]
  ): Uint8Array {
    return compressData(options, ...data)
  }
  public decompressSync(options: InflateOptions, data: Uint8Array): Uint8Array {
    return decompressData(data, options)
  }

  public listCacheFiles(): string[] {
    return listCacheFiles(this.cacheDir)
  }

  public removeCacheFile(filename: string): void {
    removeCacheFile(filename, this.cacheDir)
  }
  /**
   * Clears all cache files
   */
  public clearCache(): void {
    const files = this.listCacheFiles()
    for (const file of files) {
      this.removeCacheFile(file)
    }
    console.log('Cache cleared')
  }
}
