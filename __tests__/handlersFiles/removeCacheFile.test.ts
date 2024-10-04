import { removeCacheFile } from '../../src/utils/handlersFiles';
import * as fs from 'fs'
import * as path from 'path'
import {color} from '../../src/utils/color' 

jest.mock('fs')
jest.mock('path', () => ({
  join: jest.fn(),
  resolve: jest.requireActual('path').resolve // Keep actual path.resolve for other use cases
}))
jest.mock('os', () => ({
  homedir: jest.fn()
}))

describe('removeCacheFile', () => {
  const mockFilename = 'test-cache-file.txt'
  const mockDir = '/mock-dir'

  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks() // Clear mocks before each test
    // Suppress console.log and console.error during tests
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore() // Restore the original behavior after each test
    consoleErrorSpy.mockRestore()
  })

  it('should remove cache file if it exists', () => {
    const mockFilePath = '/mock-dir/test-cache-file.txt'

    ;(fs.existsSync as jest.Mock).mockReturnValue(true)
    ;(fs.unlinkSync as jest.Mock).mockImplementation(() => {})
    ;(path.join as jest.Mock).mockReturnValue(mockFilePath)

    removeCacheFile(mockFilename, mockDir)

    expect(path.join).toHaveBeenCalledWith(mockDir, mockFilename)
    expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath)
    expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${color.orangered.bold('Cache file removed:')} ${color.white.bold(mockFilename)}`
    )
  })

  it('should log an error if the file does not exist', () => {
    const mockFilePath = '/mock-dir/test-cache-file.txt'

    ;(fs.existsSync as jest.Mock).mockReturnValue(false)
    ;(path.join as jest.Mock).mockReturnValue(mockFilePath)

    removeCacheFile(mockFilename, mockDir)

    expect(path.join).toHaveBeenCalledWith(mockDir, mockFilename)
    expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath)
    expect(fs.unlinkSync).not.toHaveBeenCalled()

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `${color.red.bold('File not found: ' + color.white.bold(mockFilename))}`
    )
  })
})