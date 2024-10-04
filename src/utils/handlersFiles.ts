import {
  existsSync,
  mkdirSync,
  unlinkSync,
  readdirSync,
  writeFileSync,
  readFileSync,
} from 'fs'
import { join } from 'path'
import { tmpdir, homedir } from 'os'
import { utf8ToBytes as u8a, bytesToUtf8 as au8 } from './bytes'
import { color } from './color'

/**
 * @interface RawPreload
 * @description Represents the raw preload data.
 * @proprety {string} prefix - The prefix file of the preload.
 */
export interface RawPreload {
  [prefix: string]: {
    prefix: string
    totalSize: number
    dataStorage: Uint8Array
  }
}

/**
 * @type {Function} errorDirectory
 * @description Creates a directory for error messages.
 * @param {string} p - The path to the directory.
 * @returns {stirng} - Error message.
 */
export const errorDirectory: Function = (p: string): string =>
  `${color.red.bold(`Error reading directory:`)}${color.white.bold(p)}`

/**
 * Generates a random UUID (Universal Unique Identifier).
 *
 * @returns {string} A randomly generated UUID string.
 */
export const UUID = (): string =>
  `${Math.random().toString(16).substring(2, 10)}`

/**
 * Resolves and normalizes a file path.
 * If the path starts with `~`, it is replaced with the user's home directory.
 *
 * @param {...string[]} paths - The parts of the file path.
 * @returns {string} The resolved file path.
 */
export function resolvePath(...paths: string[]): string {
  let fullPath = join(...paths)

  // If path starts with ~, replace it with home directory
  if (fullPath.startsWith('~')) {
    fullPath = join(homedir(), fullPath.slice(1)) // Remove ~ and join with home directory
  }

  return fullPath
}

/**
 * Sets the cache directory to either the system temporary directory or the project's root cache directory.
 *
 * @param {boolean} [useTemp=false] - Whether to use the system temporary directory for cache.
 */
export function setCacheDirectory(useTemp: boolean = false): void {
  const cacheDir = useTemp ? tmpdir() : resolvePath(process.cwd(), 'cache')

  // Set the cache directory globally or in a config object
  globalThis.CACHE_DIR = cacheDir

  // Ensure the cache directory exists
  ensureDirectoryExists()
}

/**
 * Ensures that the cache directory exists, creating it if it does not.
 *
 * @returns {string} The path of the cache directory.
 */
export function ensureDirectoryExists(): string {
  const cacheDir = globalThis.CACHE_DIR

  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true, mode: 0o777 })
  }

  return cacheDir
}

/**
 * Removes a cache file from the specified directory.
 *
 * @param {string} filename - The name of the file to remove.
 * @param {string} dir - The directory containing the file.
 */
export function removeCacheFile(filename: string, dir: string): void {
  const filePath = resolvePath(dir, filename)

  if (existsSync(filePath)) {
    unlinkSync(filePath) // Remove file
    console.log(
      `${color.orangered.bold(`Cache file removed:`)} ${color.white.bold(filename)}`
    )
  } else {
    console.error(
      `${color.red.bold(`File not found: ${color.white.bold(filename)}`)}`
    )
  }
}

/**
 * Lists all cache files in the specified directory.
 *
 * @param {string} dir - The directory to list files from.
 * @returns {string[]} An array of file names in the directory.
 */
export function listCacheFiles(dir: string): string[] {
  try {
    return readdirSync(dir) // Read files in directory
  } catch (err) {
    console.error(errorDirectory(dir))
    return []
  }
}

/**
 * Writes binary data to a cache file.
 *
 * @param {Uint8Array} data - The binary data to write to the cache file.
 * @param {string} dir - The directory where the file will be saved.
 * @param {string} uuid - A unique identifier for the file.
 * @param {number} dataCount - A count of the data size or chunks.
 * @returns {Uint8Array} The UUID converted to bytes for later retrieval.
 */
export function writeFileBit(
  data: Uint8Array,
  dir: string,
  uuid: string,
  dataCount: number
): Uint8Array {
  const PREFIX = uuid
  const filePath = resolvePath(dir, `${PREFIX}_${dataCount}.bin`)

  writeFileSync(filePath, data) // Write data to file synchronously
  return u8a(PREFIX) // Return the UUID for later retrieval
}

/**
 * Reads binary data from a cache file.
 *
 * @param {string} nameFileBit - The name of the cache file to read.
 * @param {string} dir - The directory containing the cache file.
 * @returns {Uint8Array} The binary data read from the cache file.
 */
export function readFileBit(nameFileBit: string, dir: string): Uint8Array {
  const filePath = resolvePath(dir, `${nameFileBit}`)

  return readFileSync(filePath) // Read data synchronously
}

/**
 * Finds files in the cache directory that match a specified prefix.
 *
 * @param {Uint8Array} prefix - The prefix to search for in the file names.
 * @param {string} dir - The directory to search in.
 * @returns {string | undefined} The first matching file name, or undefined if none is found.
 */
export function findFilesByPrefix(
  prefix: Uint8Array,
  dir: string
): string | undefined {
  
    const files = listCacheFiles(dir)
    const matchingFiles = files.filter(file => file.startsWith(au8(prefix))) // Search for files starting with prefix
  if (matchingFiles.length > 0) {
    return matchingFiles[0] // Return the first matching file
  }
    return undefined // Return undefined if no matching file is found
  
}

/**
 * Preloads all cache files from the specified directory.
 *
 * @param {string} dir - The directory to preload files from.
 * @returns {RawPreload} An object containing the preloaded cache data.
 */
export function preloadAllCacheFiles(dir: string): RawPreload {
  return analyzeFiles(dir)
}

/**
 * Analyzes cache files in the specified directory.
 *
 * @param {string} dir - The directory to analyze.
 * @param {Uint8Array} [PREFIX] - An optional prefix to search for specific files.
 * @returns {RawPreload} An object containing the cache data.
 */
export function analyzeFiles(dir: string, PREFIX?: Uint8Array): RawPreload {
  let result: RawPreload = {}

  // Find cache files by PREFIX or retrieve all files
  let fileCache 

  fileCache = PREFIX
   ? findFilesByPrefix(PREFIX, dir)
   : listCacheFiles(dir)


  if (Array.isArray(fileCache)) {
    processMultipleFiles(fileCache, dir, result)
  } else if (fileCache) {
    processSingleFile(fileCache, dir, result)
  } else {
    throw new Error('File not found')
  }

  return result
}

/**
 * Processes multiple cache files.
 *
 * @param {string[]} fileCache - The array of cache file names.
 * @param {string} dir - The directory containing the cache files.
 * @param {RawPreload} result - The result object to store the processed data.
 */
export function processMultipleFiles(
  fileCache: string[],
  dir: string,
  result: RawPreload
): void {
  for (const file of fileCache) {
    if (file.endsWith('.bin')) {
      const data = readFileBit(file, dir)
      const { prefix, totalSize } = extractFileInfo(file)
      result[prefix] = {
        prefix,
        totalSize,
        dataStorage: new Uint8Array(data),
      }
    }
  }
}

/**
 * Processes a single cache file.
 *
 * @param {string} file - The cache file name.
 * @param {string} dir - The directory containing the cache file.
 * @param {RawPreload} result - The result object to store the processed data.
 */
export function processSingleFile(
  file: string,
  dir: string,
  result: RawPreload
): void {
  const data = readFileBit(file, dir)
  const { prefix, totalSize } = extractFileInfo(file)
  result[prefix] = {
    prefix,
    totalSize,
    dataStorage: new Uint8Array(data),
  }
}

/**
 * Extracts file information such as the prefix and total size from the file name.
 *
 * @param {string} fileName - The file name to extract information from.
 * @returns {Object} An object containing the file prefix and total size.
 */
export function extractFileInfo(fileName: string): {
  prefix: string
  totalSize: number
} {
  const prefix = fileName.substring(0, 8) // Extract prefix from file name
  const totalSize = parseInt(fileName.substring(9).split('.')[0], 10) // Extract total size from file name
  return { prefix, totalSize }
}
