import {findFilesByPrefix} from '../../src/utils/handlersFiles'
import { readdirSync } from 'fs'
jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}))
jest.mock('path', () => ({
  join: jest.fn(),
  resolve: jest.requireActual('path').resolve // Keep actual path.resolve for other use cases
}))
import { utf8ToBytes as arr } from '../../src/utils/bytes'
describe('findFilesByPrefix', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterEach(() => {
   jest.resetAllMocks();
  });
  it('should return an string of matching file names', () => {
    const mockDir = '/mock-dir'
    const mockPrefix = arr('12345678') // Mock prefix 8 bytes
    const mockFiles = ['12345678_1.bin', '94832456_2.bin', '45686743_3.bin']
   
    ;(readdirSync as jest.Mock).mockReturnValue(mockFiles)

    const result = findFilesByPrefix(mockPrefix, mockDir)

    expect(result).toEqual(mockFiles[0]) // Return the first matching file name
  })
  it('should return an undefined if no matching files are found', () => {
    const mockDir = '/mock-dir'
    const mockPrefix = arr('nyrenxxx') // Prefix that does not exist in mockFiles 8 characters
    const mockFiles = ['mock-12345678_1.bin', 'mock-94832456_2.bin', 'mock-opertyui_3.bin']

    ;(readdirSync as jest.Mock).mockReturnValue(mockFiles)

    const result = findFilesByPrefix(mockPrefix, mockDir)

    expect(result).toEqual(undefined)
    
  })
})