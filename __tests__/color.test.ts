import { color, bold, getColor, Colorizer, type ColorMethods } from '../src/utils/color'
import { getColorDepth } from '../src/utils/colorDepth'

// Mock getColorDepth function
jest.mock('../src/utils/colorDepth', () => ({
  ...jest.requireActual('../src/utils/colorDepth'),
  getColorDepth: jest.fn(),
}));

describe('Color Depth Module', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getColor', () => {
    it('should return the escape code for 256 color depth', () => {
      (getColorDepth as jest.Mock).mockReturnValue(8); // Mocking 256 color depth
      const result = getColor('blue');
      expect(result).toBe('\x1B[38;5;68m'); // Expect the corresponding ANSI code for blue
    });

    it('should return the escape code for 16 color depth', () => {
      (getColorDepth as jest.Mock).mockReturnValue(4); // Mocking 16 color depth
      const result = getColor('red');
      expect(result).toBe('\x1B[31m'); // Expect the corresponding ANSI code for red
    });

    it('should return an empty string for unsupported colors', () => {
      (getColorDepth as jest.Mock).mockReturnValue(8); // Mocking 256 color depth
      const result = getColor('unsupportedColor' as any);
      expect(result).toBe(''); // Expect empty string for unsupported color
    });

    it('should return an empty string when color depth is less than 4', () => {
      (getColorDepth as jest.Mock).mockReturnValue(2); // Mocking color depth < 4
      const result = getColor('green');
      expect(result).toBe(''); // Expect empty string for unsupported color
    });
  });

  describe('bold', () => {
    it('should return bolded message when supported', () => {
      (getColorDepth as jest.Mock).mockReturnValue(4); // Mocking color depth >= 4
      const message = 'Hello';
      const result = bold(message);
      expect(result).toBe('\x1B[1mHello\x1B[22m'); // Expect bold escape sequence
    });

    it('should return plain message when not supported', () => {
      (getColorDepth as jest.Mock).mockReturnValue(2); // Mocking color depth < 4
      const message = 'Hello';
      const result = bold(message);
      expect(result).toBe('Hello'); // Expect plain text
    });
  });

  describe('Colorizer class', () => {

    it('should apply color to the message', () => {
      (getColorDepth as jest.Mock).mockReturnValue(8); // Mocking 256 color depth
      const colorizer = new Colorizer('blue');
      const message = 'Hello, nyren';
      const result = colorizer.apply(message);
      expect(result).toBe('\x1B[38;5;68mHello, nyren\x1B[39m\x1B[22m'); // Expect styled message
    });
    it('class Colorizer macth func color to the message', () => {
      (getColorDepth as jest.Mock).mockReturnValue(8); // Mocking 256 color depth
      const colorizer = new Colorizer('blue');
      const message = 'Hello, nyren';
      const result = colorizer.apply(message);
      expect(result).toBe(color.blue(message)); // Expect styled message
    });

    it('should apply bold style to the message', () => {
      (getColorDepth as jest.Mock).mockReturnValue(4); // Mocking color depth >= 4
      const colorizer = new Colorizer('red');
      const message = 'Hello, nyren';
      const result = colorizer.bold().apply(message);
      expect(result).toBe(color.red.bold(message)); // Expect styled message with bold
    });

    it('should not apply color if color depth is less than 4', () => {
      (getColorDepth as jest.Mock).mockReturnValue(0); // Mocking color depth < 4
      const colorizer = new Colorizer('green');
      const message = 'Hello, nyren';
      const result = colorizer.apply(message);
      expect(result).toBe('Hello, nyren\x1B[39m\x1B[22m'); // Expect plain text
    });
  });
  describe('Color Proxy', () => {
    it('should apply bold style', () => {
      const message = 'Hello World';
      const result = color.red.bold(message);


      expect(result).toMatch(/\x1B\[22m/); 
      expect(result).toContain(message); 
    });

      it('should return a function for other styles', () => {
        (getColorDepth as jest.Mock).mockReturnValue(8); 
        const message = 'Hello World';

        
        const otherStyle = 'italic' as keyof ColorMethods; 

        const applyFunction = color.blue[otherStyle]; 
        const result = applyFunction(message);

        
        expect(result).toBe(`\x1B[38;5;68m${message}\x1B[39m\x1B[22m`); // not style
      });
    });
});
