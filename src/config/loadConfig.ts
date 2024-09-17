import { resolve } from 'path';
import { existsSync } from 'fs';


export function loadConfig(): Config256k1 {

const configPath = resolve(process.cwd(), 'ts256k1.config.cjs');
let config: Config256k1 

if (existsSync(configPath)) {
  config = require(configPath); 
} else {
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