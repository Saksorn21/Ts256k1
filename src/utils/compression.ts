import {
  Deflate,
  Inflate,
  constants as StrategyOpt,
  type DeflateFunctionOptions,
  type InflateOptions,
  type DeflateOptions,
} from 'pako'

/**
 * CompressOpts is a type that extends DeflateOptions with additional 'coverage' property
 * @type {Object} CompressOpts
 * @property {1 | 2 | 3 | 4 | null} coverage - Specifies the level of compression coverage.
 */
export type CompressOpts = DeflateOptions & {
  coverage: 1 | 2 | 3 | 4 | null
}

/**
 * Compresses the provided data using an optional dictionary and specified options.
 *
 * @param {Uint8Array} dictionary - The optional dictionary to use for compression.
 * @param {DeflateOptions} options - The options for the compression process.
 * @param {Uint8Array[]} data - The data to be compressed.
 * @returns {Uint8Array} - The compressed data.
 */
function compressData(
  dictionary: Uint8Array,
  options: DeflateOptions,
  ...data: Uint8Array[]
): Uint8Array

/**
 * Compresses the provided data using specified options.
 *
 * @param {DeflateOptions} options - The options for the compression process.
 * @param {Uint8Array[]} data - The data to be compressed.
 * @returns {Uint8Array} - The compressed data.
 */
function compressData(
  options: DeflateOptions,
  ...data: Uint8Array[]
): Uint8Array

/**
 * Compresses a single Uint8Array using an optional dictionary and specified options.
 *
 * @param {Uint8Array} dictionary - The optional dictionary to use for compression.
 * @param {DeflateOptions} options - The options for the compression process.
 * @param {Uint8Array} data - The data to be compressed.
 * @returns {Uint8Array} - The compressed data.
 */
function compressData(
  dictionary: Uint8Array,
  options: DeflateOptions,
  data: Uint8Array
): Uint8Array

/**
 * Compresses a single Uint8Array using specified options.
 *
 * @param {DeflateOptions} options - The options for the compression process.
 * @param {Uint8Array} data - The data to be compressed.
 * @returns {Uint8Array} - The compressed data.
 */
function compressData(options: DeflateOptions, data: Uint8Array): Uint8Array

/**
 * Compresses the provided data using an optional dictionary or specified options.
 *
 * @param {Uint8Array | DeflateOptions} dictionaryOrOptions - The optional dictionary or options for compression.
 * @param {DeflateOptions | Uint8Array} optionsOrData - The options for compression or data to compress.
 * @param {Uint8Array[]} data - The data to be compressed.
 * @returns {Uint8Array} - The compressed data.
 */
function compressData(
  dictionaryOrOptions: Uint8Array | DeflateOptions,
  optionsOrData: DeflateOptions | Uint8Array,
  ...data: Uint8Array[]
): Uint8Array {
  let dictionary: Uint8Array | undefined
  let opts: DeflateOptions
  let dataArray: Uint8Array[]
  let compress: Deflate

  if (dictionaryOrOptions instanceof Uint8Array) {
    dictionary = dictionaryOrOptions
    opts = optionsOrData as DeflateOptions

    if (data.length > 0) {
      dataArray = data
    } else {
      dataArray = [optionsOrData as Uint8Array]
    }
  } else {
    dictionary = undefined
    opts = dictionaryOrOptions as DeflateOptions

    if (data.length > 0) {
      dataArray = [optionsOrData as Uint8Array, ...data]
    } else {
      dataArray = [optionsOrData as Uint8Array]
    }
  }

  compress = new Deflate({
    level: opts.level ?? 1,
    strategy: opts.strategy ?? StrategyOpt.Z_FILTERED,
    raw: opts.raw ?? true,
    windowBits: opts.windowBits ?? -15,
    memLevel: opts.memLevel ?? 9,
    ...(dictionary && { dictionary }),
    ...opts,
  })

  dataArray.forEach((dataPiece, index) => {
    compress.push(dataPiece, index === dataArray.length - 1)
  })

  if (compress.err) {
    console.error('Compression error:', compress.msg)
    throw new Error('Compression error' + compress.msg)
  }

  return compress.result
}

/**
 * Decompresses the provided data using the specified options.
 *
 * @param {Uint8Array} data - The compressed data to decompress.
 * @param {InflateOptions} [opts] - Optional settings for the decompression.
 * @returns {Uint8Array} - The decompressed data.
 */
function decompressData(data: Uint8Array, opts?: InflateOptions): Uint8Array {
  const decompressedData = new Inflate({
    windowBits: opts?.windowBits || -15,
    raw: opts?.raw ?? true,
    dictionary: opts?.dictionary,
  })

  decompressedData.push(data, true)

  if (decompressedData.err) {
    throw new Error(`Decompression error: ${decompressedData.msg}`)
  }

  return decompressedData.result as Uint8Array
}

/**
 * Calculates the total size and chunk size based on the input data array and chunk count.
 *
 * @param {Uint8Array[]} dataArray - The array of data to calculate size from.
 * @param {number} chunkCount - The number of chunks to divide the total size into.
 * @returns {{ totalSize: number; chunkSize: number }} - The total size and chunk size.
 * @throws Will throw an error if chunkCount is less than or equal to zero.
 */
function calculateChunkSize(
  dataArray: Uint8Array[],
  chunkCount: number
): { totalSize: number; chunkSize: number } {
  if (chunkCount <= 0) {
    throw new Error('chunkCount must be greater than 0.')
  }

  const totalSize = dataArray.reduce((sum, data) => sum + data.length, 0)
  const chunkSize = Math.ceil(totalSize / chunkCount)

  return { totalSize, chunkSize: Math.min(chunkSize, totalSize) }
}
export { compressData, decompressData, calculateChunkSize }
// Exporting the types used
export type { DeflateFunctionOptions, InflateOptions, DeflateOptions }
