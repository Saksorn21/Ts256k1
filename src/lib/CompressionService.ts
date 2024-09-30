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

/**
 * CompressionService class handles the compression and decompression of data,
 * as well as caching the compressed data into files.
 */
export class CompressionService {
  private cache = new Map<string, CacheEntry>()

  /**
   * Extracts a portion of the data to be used as the compression dictionary.
   *
   * @param {Uint8Array} data - The data from which the dictionary will be extracted.
   * @param {1 | 2 | 3 | 4 | null} coverage - Determines the portion of the data to be used as the dictionary.
   * - `1`, `2`, `3`, `4` represent the percentage of the data that will be used, with 1 being the smallest portion and 4 the largest.
   * - `null` means no dictionary is extracted, returning an empty Uint8Array.
   * @returns {Uint8Array} - The extracted portion of the data to be used as a dictionary.
   */
  static extractDictionary(
    data: Uint8Array,
    coverage: CompressOpts['coverage']
  ): Uint8Array {
    const quarter = data.length / 4
    const coverageFactor = coverage === null ? 0 : coverage
    const end = Math.round(quarter * coverageFactor)
    return data.subarray(0, end)
  }

  /**
   * Creates an instance of CompressionService and sets up the cache directory.
   *
   * @param {boolean} [useTemp=false] - Whether to use the system's temporary directory for cache.
   */
  constructor(useTemp: boolean = false) {
    setCacheDirectory(useTemp)
    this.preloadAllCacheFiles(this.cacheDir)
  }

  /**
   * Returns the generated UUID for cache file names.
   *
   * @returns {string} - A UUID string.
   */
  get UUID(): string {
    return UUID()
  }

  /**
   * Returns the directory where the cache files are stored.
   *
   * @returns {string} - Cache directory path.
   */
  get cacheDir(): string {
    return globalThis.CACHE_DIR
  }

  /**
   * Compresses the provided data using the given options.
   *
   * @param {Uint8Array} data - The data to be compressed.
   * @param {CompressOpts} options - The compression options, including the dictionary coverage.
   * @returns {Uint8Array} - The compressed data with a UUID prefix.
   */
  public compress(data: Uint8Array, options: CompressOpts): Uint8Array {
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

    const { coverage, ...optsByDeflate } = options
    const compressedData = compressData(
      dictionary,
      { chunkSize: totalSize, ...optsByDeflate },
      data
    )
    return concatBytes(prefixUUID, compressedData)
  }

  /**
   * Decompresses the provided compressed data using the given options.
   *
   * @param {Uint8Array} data - The compressed data to be decompressed.
   * @param {InflateOptions} [options] - The decompression options.
   * @returns {Uint8Array} - The decompressed data.
   * @throws {Error} - If the prefix does not match the cached dictionary.
   */
  public decompress(data: Uint8Array, options?: InflateOptions): Uint8Array {
    const prefix = bytesToUtf8(
      data.subarray(0, ConstsType.PREFIX_COMPRESS_LENGTH)
    )

    if (!this.cache.has(prefix)) {
      this.preloadOneCacheFile(prefix, this.cache)
    }

    const { PREFIXUUID, totalSize, dataStorage } = this.cache.get(
      prefix
    ) as CacheEntry

    if (prefix !== PREFIXUUID) {
      throw new Error(`Prefix not match ${prefix}, got ${PREFIXUUID}`)
    }

    return decompressData(data.subarray(ConstsType.PREFIX_COMPRESS_LENGTH), {
      chunkSize: totalSize,
      dictionary: dataStorage,
      ...options,
    })
  }

  /**
   * Compresses multiple Uint8Array data synchronously using deflate options.
   *
   * @param {DeflateOptions} options - The deflate compression options.
   * @param {...Uint8Array} data - The data chunks to be compressed.
   * @returns {Uint8Array} - The compressed data.
   */
  public compressSync(
    options: DeflateOptions = {},
    ...data: Uint8Array[]
  ): Uint8Array {
    return compressData(options, ...data)
  }

  /**
   * Decompresses multiple Uint8Array data synchronously using inflate options.
   *
   * @param {InflateOptions} options - The inflate decompression options.
   * @param {Uint8Array} data - The compressed data to be decompressed.
   * @returns {Uint8Array} - The decompressed data.
   */
  public decompressSync(options: InflateOptions = {}, data: Uint8Array): Uint8Array {
    return decompressData(data, options)
  }

  /**
   * Lists all cache files in the current cache directory.
   *
   * @returns {string[]} - An array of cache file names.
   */
  public listCacheFiles(): string[] {
    return listCacheFiles(this.cacheDir)
  }

  /**
   * Removes a specific cache file by filename.
   *
   * @param {string} filename - The name of the cache file to remove.
   */
  public removeCacheFile(filename: string): void {
    removeCacheFile(filename, this.cacheDir)
  }

  /**
   * Clears all cache files from the cache directory.
   */
  public clearCache(): void {
    const files = this.listCacheFiles()
    for (const file of files) {
      this.removeCacheFile(file)
    }
    console.log('Cache cleared')
  }

  /**
   * Preloads a single cache file into memory using its prefix.
   *
   * @param {string} prefix - The prefix of the cache file.
   * @param {Map<string, CacheEntry>} cache - The cache map to store the loaded file.
   */
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

  /**
   * Preloads all cache files from the cache directory into memory.
   *
   * @param {string} dir - The cache directory to load files from.
   */
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
}

export type { CompressOpts, InflateOptions, DeflateOptions, RawPreload }
