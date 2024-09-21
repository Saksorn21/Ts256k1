import { resolve } from 'path';
import { existsSync } from 'fs';

/**
 * @function loadConfig
 * @description
 * Loads the configuration from the provided path.
 * @returns {Config256k1} - The loaded configuration object.
 */
export function loadConfig(): Config256k1 {
// Check if the config file exists in the current directory root project
const configPath = resolve(process.cwd(), 'ts256k1.config.cjs');
let config: Config256k1 
// If the config file exists, load it 
if (existsSync(configPath)) {
  config = require(configPath); 
} else {
  // default config see https://github.com/Saksorn21/Ts256k1?tab=readme-ov-file#configuration
  config = {
    hkdfKeyCompressed: false, 
    ephemeralKeyCompressed: false ,
    signature: {
        enabled: true,
        throwOnInvalid: true,
        errorMessage: 'Invalid signature',
      useLowS: true
    }
  };
}
  return config
}