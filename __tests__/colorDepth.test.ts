import { getColorDepth } from '../src/utils/colorDepth'


import { WriteStream } from 'tty'; // หรือตามที่คุณนำเข้า WriteStream
describe('getColorDepth', () => {
  beforeEach(() => {
    // Reset process.env before each test
    process.env = {};
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  afterEach(() => {
    // Restore original function after each test
    jest.restoreAllMocks();
  });

  test('returns WriteStream.prototype.getColorDepth()', () => {
    const mockGetColorDepth = jest.spyOn(WriteStream.prototype, 'getColorDepth').mockReturnValue(8);

    const depth = getColorDepth();
    expect(depth).toBe(8);

    mockGetColorDepth.mockRestore(); // Restore the original method
  });

  test('falls back to process.env.TERM when getColorDepth throws an error', () => {
    jest.spyOn(WriteStream.prototype, 'getColorDepth').mockImplementation(() => {
      throw new TypeError('Not a function');
    });

    process.env.TERM = 'xterm-256color';

    const depth = getColorDepth();
    expect(depth).toBe(8);
  });

  test('falls back to 4 when no process.env.TERM when getColorDepth throws an error', () => {
    jest.spyOn(WriteStream.prototype, 'getColorDepth').mockImplementation(() => {
      throw new TypeError('Not a function');
    });

    const depth = getColorDepth();
    expect(depth).toBe(4);
  });

  test('falls back to 4 when process.env.TERM neither xterm nor 256color when getColorDepth throws an error', () => {
    process.env.TERM = 'rxvt-16color';

    jest.spyOn(WriteStream.prototype, 'getColorDepth').mockImplementation(() => {
      throw new TypeError('Not a function');
    });

    const depth = getColorDepth();
    expect(depth).toBe(4);
  });
});