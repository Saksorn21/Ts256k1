
import { readFileSync } from 'fs'
import { processSingleFile, readFileBit, extractFileInfo } from '../../src/utils/handlersFiles'
import type {RawPreload} from '../../src/utils/handlersFiles'
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}))
jest.mock('../../src/utils/handlersFiles', () => {
  const actualModule = jest.requireActual('../../src/utils/handlersFiles');
  return{
    ...actualModule,
  readFileBit: jest.fn(),
  extractFileInfo: jest.fn(),
}})

describe('processSingleFile', () => {
  let mockDir: string
  let mockFile: string
  let result: RawPreload
  let mockReadFileBit: jest.MockedFunction<typeof readFileBit>

  beforeEach(() => {
    mockDir = '/mockDir'
    mockFile = 'mockFile_100.bin'
    result = {} as RawPreload

    // Assign the mock
    mockReadFileBit = readFileBit as jest.MockedFunction<typeof readFileBit>

    // Mock the return values properly
     ;(mockReadFileBit).mockReturnValueOnce(new Uint8Array([1, 2, 3, 4]));
      
    ;(extractFileInfo as jest.MockedFunction<typeof extractFileInfo>).mockReturnValue({
      prefix: 'mockFile',
      totalSize: 100,
    })

     ;(readFileSync as jest.Mock).mockReturnValue(new Uint8Array([1, 2, 3, 4]))
  })
  afterEach(() => {
   jest.restoreAllMocks();
  });

  it('should process a single file and add it to the result object', () => {
    processSingleFile(mockFile, mockDir, result)

    // Ensure the mock functions were called
    expect(readFileSync).toHaveBeenCalledWith(`${mockDir}/${mockFile}`)
    //expect(mockReadFileBit).toHaveBeenCalledWith(mockFile, mockDir)
    //expect(extractFileInfo).toHaveBeenCalledWith(mockFile)

    // Ensure the result object contains expected data
    expect(result).toEqual({
      mockFile: {
        prefix: 'mockFile',
        totalSize: 100,
        dataStorage: new Uint8Array([1, 2, 3, 4]),
      },
    })
  })
})