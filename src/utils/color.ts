import { getColorDepth } from './colorDepth'


/**
 * @interface ColorMethods - An interface for the color methods.
 * @description Represents methods for applying color styles.
 */
interface ColorMethods {
  (message: string): string;
  bold: (message: string) => string;
}

/**
 * @type {ColorName} - A type representing available color names.
 */
type ColorName = 'blue' | 'gray' | 'green' | 'plum' | 'orangered' | 'red' | 'olive' | 'white' | 'cyan';

/**
 * @type {ColorInterface} - A map from color names to color methods.
 * @description Represents an interface for accessing color methods by name.
 */
type ColorInterface = {
  [color in ColorName]: ColorMethods;
};

/**
 * Define color mappings for 16 colors and 256 colors
 * @see https://www.ditig.com/publications/256-colors-cheat-sheet/
 * @see https://tforgione.fr/posts/ansi-escape-codes/#the-special-character
 */

/**
 * A map containing 16-color ANSI codes.
 * Each color name is mapped to its respective 16-color terminal code.
 * 
 * @type {Map<string, number>}
 */
const color16: Map<string, number> = new Map<string, number>([
  ['blue', 34],
  ['gray', 37], // mapped to white
  ['green', 32],
  ['plum', 35], // mapped to magenta
  ['orangered', 31], // mapped to red
  ['red', 31],
  ['olive', 33],
  ['white', 37],
  ['cyan', 36]
]);

/**
 * A map containing 256-color ANSI codes.
 * Each color name is mapped to its respective 256-color terminal code.
 * 
 * @type {Map<string, number>}
 */
const color256: Map<string, number> = new Map<string, number>([
  ['blue', 68], // mapped to SteelBlue3
  ['gray', 244], // mapped to Grey50
  ['green', 71], // mapped to DarkSeaGreen4
  ['plum', 176], // mapped to Plum3
  ['orangered', 208], // mapped to DarkOrange
  ['red', 196], // mapped to Red1
  ['olive', 178], // mapped to Gold3
  ['white', 231], // mapped to Grey100
  ['cyan', 111] // mapped to Grey100
]);

/**
 * @function getColor
 * @description Returns the escape code for a specified color name based on the terminal's color depth.
 * @param {ColorName} color - The color name.
 * @returns {string} - The escape code for the specified color or an empty string if unsupported.
 */
const getColor: Function = function (color: ColorName): string {
  const colorDepth = getColorDepth(); 

  // If no color is found in the mapping, return an empty string.
  if (!color256.has(color)) return ''; 

  // If color depth is 256, return the color code
  if (colorDepth >= 8) {
    const code = color256.get(color);
    return `\x1B[38;5;${code}m`;
  }
  // If color depth is 16, return the color code
  if (colorDepth >= 4) {
    const code = color16.get(color);
    return `\x1B[${code}m`;
  }
  // If color depth is less than 4, return an empty string
  return ''; // No color
};

/**
 * @function bold
 * @description Returns the bold escape sequence for the provided message if supported by the terminal.
 * If not supported, it returns the message as plain text.
 * @param {string} message - The message to be bolded.
 * @returns {string} - The bolded message or plain text if unsupported.
 */
const bold = (message: string): string => getColorDepth() >= 4 ? `\x1B[1m${message}\x1B[22m` : message; // Reset style

/**
 * @constant
 * @description Defines the reset codes for color, style, and all attributes.
 * @type {Record<string, string>}
 */
const reset: Record<string, string> = {
  color: '\x1B[39m',
  style: '\x1B[22m',
  all: '\x1B[0m'
};

/**
 * @class Colorizer
 * @description A class responsible for applying color and style to a message.
 */
class Colorizer {
  private styles: Array<(message: string) => string> = [];
  private colorCode: string = '';

  /**
   * @constructor
   * @param {ColorName} color - The name of the color to apply.
   */
  constructor(private color: ColorName) {
    this.colorCode = getColor(this.color); // Get color code from the getColor function
  }

  /**
   * @private
   * @function applyStyles
   * @description Applies all registered styles to the message.
   * @param {string} message - The message to apply the styles to.
   * @returns {string} - The styled message.
   */
  private applyStyles(message: string): string {
    let styledMessage = this.colorCode + message + reset.color;

    this.styles.forEach((style) => {
      styledMessage = style(styledMessage);
    });

    return styledMessage + reset.style;
  }

  /**
   * @function bold
   * @description Adds the bold style to the message.
   * @returns {this} - The current Colorizer instance for chaining.
   */
  bold(): this {
    this.styles.push((message: string) => bold(message));
    return this;
  }

  /**
   * @function apply
   * @description Applies the color and styles to the given message.
   * @param {string} message - The message to be styled.
   * @returns {string} - The fully styled message.
   */
  apply(message: string): string {
    return this.applyStyles(message);
  }
}

/**
 * @constant
 * @description Proxy object that allows dynamic access to color and style functions.
 * @type {ColorInterface}
 */
const color: ColorInterface = new Proxy({} as ColorInterface, {
  get(_, colorName: ColorName) {
    const applyColor = (message: string) => new Colorizer(colorName).apply(message);
    return new Proxy(applyColor, {
      get(target, style: 'bold') {
        // If the style is bold, return a new Colorizer that applies bold style to the message
        if (style === 'bold') {
          return (message: string) => new Colorizer(colorName).bold().apply(message);
        }
        return target;
      }
    });
  }
});

/**
 * The default export provides access to color, reset, and bold functions.
 * @type {{ color: typeof color, reset: typeof reset, bold: typeof bold }}
 */
const namespace: { color: typeof color, reset: typeof reset, bold: typeof bold } = { color, reset, bold };

export { color, reset, bold };
export default namespace;


