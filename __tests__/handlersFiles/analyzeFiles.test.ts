
import {
  
  readdirSync,
} from 'fs'
//import { homedir, tmpdir } from 'os'
import { analyzeFiles, errorDirectory } from '../../src/utils/handlersFiles'
import { findFilesByPrefix } from '../../src/utils/handlersFiles'
import {utf8ToBytes as u8} from '../../src/utils/bytes'
// Mock fs functions
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  unlinkSync: jest.fn(),
  readdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}))

// Mock os functions
jest.mock('os', () => ({
  homedir: jest.fn().mockReturnValue('/mock/home'),
  tmpdir: jest.fn().mockReturnValue('/mock/tmp'),
}))
jest.mock('../../src/utils/handlersFiles', () => {
  const actualModule = jest.requireActual('../../src/utils/handlersFiles'); // Import actual functions
  return {
    ...actualModule,
    findFilesByPrefix: jest.fn(), // Mock only specific functions
  };
});

describe('File Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
  })
  afterEach(() => {
   jest.restoreAllMocks();
  });
  
  describe('analyzeFiles', () => {
    const mockfiles = ['12345678_1.bin', 'qwertyui_2.bin', '87654321_1.bin']
    it('The prefix cache file should be analyzed and the raw preload data returned in singular format.', () => {
      
      ;(readdirSync as jest.Mock).mockReturnValue(mockfiles)

      const result = analyzeFiles('/mock/cache',u8('12345678'))

      expect(readdirSync).toHaveBeenCalledWith('/mock/cache')
      expect(result).toEqual({
        '12345678': {
          prefix: '12345678',
          totalSize: 1,
          dataStorage: expect.any(Uint8Array),
        },
      })
    })
    it('Should analyze the non-existent prefix cache file and return a throw.', () => {
const prefix = u8('04593456')
  const mockDir = '/mock/cache'
    const result = () => analyzeFiles(mockDir, prefix)
      ;(readdirSync as jest.Mock).mockReturnValue(mockfiles)
        ;(findFilesByPrefix as jest.Mock).mockReturnValue(undefined);
      
      expect(result).toThrow('File not found')
  })

    it('should analyze cache files and return RawPreload data', () => {
      ;(readdirSync as jest.Mock).mockReturnValue(['12345678_100.bin'])

      const result = analyzeFiles('/mock/cache')

      expect(readdirSync).toHaveBeenCalledWith('/mock/cache')
      expect(result).toEqual({
        '12345678': {
          prefix: '12345678',
          totalSize: 100,
          dataStorage: expect.any(Uint8Array),
        },
      })
    })

    it('should return an empty object and log error on failure', () => {
      ;(readdirSync as jest.Mock).mockImplementation(() => { throw new Error('Read error') })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = analyzeFiles('/mock/cache')

      expect(result).toEqual({})
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorDirectory('/mock/cache'))
    })
  })
})