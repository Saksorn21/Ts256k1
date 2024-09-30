import { WriteStream } from 'tty'
import { env } from 'process'

/**
 * @function getColorDepth
 * @description Determines the terminal's color depth.
 *
 * This function attempts to get the color depth from `WriteStream.prototype.getColorDepth()`.
 * If it fails, the function checks the `TERM` environment variable for common terminal types
 * that support 256 colors (e.g., `xterm-256color`). If the terminal supports 256 colors,
 * it returns 8 (for 256 color terminals). Otherwise, it returns 4 (for 16 color terminals).
 *
 * @returns {number} - The color depth of the terminal. Possible values are:
 *                     - 8 for 256 color terminals
 *                     - 4 for 16 color terminals
 */
export function getColorDepth(): number {
  try {
    return WriteStream.prototype.getColorDepth()
  } catch (error: unknown) {
    const terminal = env.TERM

    // Check for common terminal types that support 256 colors
    if (terminal) {
      if (terminal.includes('256color') || terminal.includes('xterm')) {
        return 8 // 256 color terminal
      }
    }
    return 4 // Default to 16 color terminal
  }
}
