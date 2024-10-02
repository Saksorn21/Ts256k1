

import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import {
  UUID,
    resolvePath,
    setCacheDirectory,
    ensureDirectoryExists,
    //removeCacheFile,
    listCacheFiles,
    writeFileBit,
    readFileBit,
    errorDirectory,
    //findFilesByPrefix,
} from '../src/utils/handlersFiles';  

jest.mock('fs')
jest.mock('os')
jest.mock('../src/utils/color', () => ({
  color: {
    red: {
      bold: jest.fn((text) => `RED_BOLD(${text})`)
    },
    white: {
      bold: jest.fn((text) => `WHITE_BOLD(${text})`)
    }
  }
}))
describe('Cache Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('UUID', () => {
    it('should generate a string of length 8', () => {
      const uuid = UUID()
      expect(uuid).toHaveLength(8)
    })

    it('should generate unique values', () => {
      const uuid1 = UUID()
      const uuid2 = UUID()
      expect(uuid1).not.toEqual(uuid2)
    })
  })

  describe('resolvePath', () => {
    it('should join path segments', () => {
      const result = resolvePath('foo', 'bar', 'baz')
      expect(result).toBe(path.join('foo', 'bar', 'baz'))
    })

    it('should replace ~ with home directory', () => {
      jest.spyOn(os, 'homedir').mockReturnValue('/home/user')
      const result = resolvePath('~/foo', 'bar')
      expect(result).toBe('/home/user/foo/bar')
    })
  })

  describe('setCacheDirectory', () => {
    it('should set cache directory to temp when useTemp is true', () => {
      jest.spyOn(os, 'tmpdir').mockReturnValue('/tmp')
      setCacheDirectory(true)
      expect(globalThis.CACHE_DIR).toBe('/tmp')
    })

    it('should set cache directory to project root when useTemp is false', () => {
      jest.spyOn(process, 'cwd').mockReturnValue('/project')
      setCacheDirectory(false)
      expect(globalThis.CACHE_DIR).toBe('/project/cache')
    })
  })

  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false)
      const mkdirSyncMock = jest.spyOn(fs, 'mkdirSync').mockImplementation()

      globalThis.CACHE_DIR = '/cache'
      ensureDirectoryExists()

      expect(mkdirSyncMock).toHaveBeenCalledWith('/cache', { recursive: true, mode: 0o777 })
    })

    it('should not create directory if it already exists', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)
      const mkdirSyncMock = jest.spyOn(fs, 'mkdirSync').mockImplementation()

      globalThis.CACHE_DIR = '/cache'
      ensureDirectoryExists()

      expect(mkdirSyncMock).not.toHaveBeenCalled()
    })
  })

  describe('writeFileBit and readFileBit', () => {
    it('should write and read file correctly', () => {
      const data = Buffer.from(new Uint8Array([1, 2, 3, 4]))
      const dir = '/cache'
      const uuid = 'abcdef12'
      const dataCount = 1

      const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync').mockImplementation()
      const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockReturnValue(data)

      writeFileBit(data, dir, uuid, dataCount)
      const readData = readFileBit(`${uuid}_${dataCount}.bin`, dir)

      expect(writeFileSyncMock).toHaveBeenCalledWith(
        path.join(dir, `${uuid}_${dataCount}.bin`),
        data
      )
      expect(readFileSyncMock).toHaveBeenCalledWith(path.join(dir, `${uuid}_${dataCount}.bin`))
      expect(readData).toEqual(data)
    })
  })

  describe('errorDirectory', () => {
    it('should format error message correctly', () => {
      const result = errorDirectory('/test/dir')
      expect(result).toBe('RED_BOLD(Error reading directory:)WHITE_BOLD(/test/dir)')
    })
  })

  describe('listCacheFiles', () =>{
    it('should return an array of file names', () =>{
      const dir = '/cache'
      const files = [{name: 'file1.bin'}, {name:'file2.bin'}, {name:'file3.bin'}]
      const fileNames = files.map(file => path.join(dir, file.name))
      const dirfile = fileNames.map(f => ({ name: f } as fs.Dirent))
      jest.spyOn(fs, 'readdirSync').mockReturnValue(dirfile)

      const result = listCacheFiles(dir)
      
      expect(Array.from(result)).toEqual(dirfile) // Convert result to array for comparison
    })


  it('should return an empty array and log error on failure', () => {
      const mockError = new Error('Read error')
      jest.spyOn(fs, 'readdirSync').mockImplementation(() => { throw mockError })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = listCacheFiles('/cache')

      expect(result).toEqual([])
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'RED_BOLD(Error reading directory:)WHITE_BOLD(/cache)'
      )
    })
  })
  
})