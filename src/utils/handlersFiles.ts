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

import { ConstsType } from '../config'
export interface RawPreload {
  [name: string]: {
    prefix: string
    totalSize: number
    dataStorage: Uint8Array
  }
}

export const UUID = (): string =>
  `${Math.random().toString(16).substring(2, 10)}`

export function resolvePath(...paths: string[]): string {
  let fullPath = join(...paths)

  // ถ้า path เริ่มต้นด้วย ~ ให้ขยายเป็น home directory
  if (fullPath.startsWith('~')) {
    fullPath = join(homedir(), fullPath.slice(1)) // ลบ ~ แล้วรวมกับ home directory
  }

  return fullPath
}
// Set cache directory
export function setCacheDirectory(useTemp: boolean = false): void {
  const cacheDir = useTemp ? tmpdir() : resolvePath(process.cwd(), 'cache')

  // Set custom cache directory path globally or as part of a config object
  globalThis.CACHE_DIR = cacheDir

  // ตรวจสอบว่ามี directory แล้วหรือยัง ถ้าไม่มีก็สร้าง
  ensureDirectoryExists()
}

// Ensure directory exists, create if not
export function ensureDirectoryExists(): string {
  const cacheDir = globalThis.CACHE_DIR // ใช้ default path ถ้าไม่มีการตั้งค่า

  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true })
  }

  return cacheDir
}

// Remove a cache file
export function removeCacheFile(filename: string, dir: string): void {
  const filePath = resolvePath(dir, filename)

  if (existsSync(filePath)) {
    unlinkSync(filePath) // ลบไฟล์
    console.log(`Cache file removed: ${filename}`)
  } else {
    console.error(`File not found: ${filename}`)
  }
}

// List all cache files
export function listCacheFiles(dir: string): string[] {
  try {
    return readdirSync(dir) // อ่านรายชื่อไฟล์ในไดเรกทอรี
  } catch (err) {
    console.error(`Error reading directory: ${dir}`, err)
    return []
  }
}

// Write binary data to cache file
export function writeFileBit(
  data: Uint8Array,
  dir: string,
  uuid: string,
  dataCount: number
): Uint8Array {
  const PREFIX = uuid
  const filePath = resolvePath(dir, `${PREFIX}_${dataCount}.bin`)

  writeFileSync(filePath, data) // เขียนข้อมูลลงไฟล์แบบ synchronous
  return u8a(PREFIX) // Return the UUID for later retrieval
}

// Read binary data from cache file
export function readFileBit(nameFileBit: string, dir: string): Uint8Array {
  const filePath = resolvePath(dir, `${nameFileBit}`)

  const data = readFileSync(filePath) // อ่านข้อมูลแบบ synchronous
  return data // คืนค่า Uint8Array
}

// Find files by prefix in the directory
export function findFilesByPrefix(
  prefix: Uint8Array,
  dir: string
): string | undefined {
  try {
    const files = listCacheFiles(dir) // อ่านไฟล์ในไดเรกทอรีแบบ synchronous
    const matchingFiles = files.filter(file => file.startsWith(au8(prefix))) // ค้นหาไฟล์ที่ขึ้นต้นด้วย prefix
    console.log('matchingFiles', matchingFiles)
    return matchingFiles[0] // คืนค่าไฟล์แรกที่ตรงกับ prefix
  } catch (err) {
    console.error(`Error reading directory: ${dir}`, err)
    return undefined
  }
}

export function preloadAllCacheFiles(dir: string): RawPreload {
  let prefix: string = ''
  let raw: RawPreload = {}
  let totalSize: number = 0
  let data: Uint8Array = new Uint8Array()

  return analyzeFiles(dir)
}
export function analyzeFiles(dir: string, PREFIX?: Uint8Array): RawPreload {
  let result: RawPreload = {}

  // ค้นหาไฟล์ตาม PREFIX หรือดึงไฟล์ทั้งหมด
  const fileCache = PREFIX
    ? findFilesByPrefix(PREFIX, dir)
    : listCacheFiles(dir)

  // ตรวจสอบว่า fileCache เป็น array หรือไฟล์เดี่ยว
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
 * ประมวลผลหลายไฟล์
 */
function processMultipleFiles(
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
 * ประมวลผลไฟล์เดี่ยว
 */
function processSingleFile(
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
 * แยกข้อมูลจากชื่อไฟล์ เช่น prefix และ totalSize
 */
function extractFileInfo(fileName: string): {
  prefix: string
  totalSize: number
} {
  const prefix = fileName.substring(0, 8) // ดึงค่าจากชื่อไฟล์ (ตัวอย่าง)
  const totalSize = parseInt(fileName.substring(9).split('.')[0], 10) // แปลงเป็นตัวเลขจากชื่อไฟล์
  return { prefix, totalSize }
}
