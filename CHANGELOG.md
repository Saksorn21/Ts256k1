# Changelog

## [1.1.1] - 2024-09-30
### Added
- **New methods**: Added `encryptAndCompress` and `decryptAndDecompress` in the `Service` class for managing encrypted data with compression.
- **Colorize Function**: Added a new function `color` to colorize text output. See the documentation for usage details.
- **CompressionService Class**: Added the `CompressionService` class to handle data compression, decompression, and cache management. Supports data compression using the Deflate/Inflate class.
  
### Changed
- **README.md**: Updated to fix typos and improve clarity.
- **Utils Structure**: Modified the utils file structure. This change does not affect existing functionality.
- **Utils Export**: Updated utils export default structure.

## [1.0.3] - 2024-09-22
### Changed
- **README.md**: Updated to fix typos and improve clarity.

## [1.0.2] - 2024-09-22
### Changed
- **README.md**: Updated to fix typos and improve clarity.

## [1.0.1] - 2024-09-22
### Changed
- **Refactor**: Refactored the `Ts256k1` class to extend the `Service` class, instead of creating a new instance using `new Service`.

## [1.0.0] - 2024-09-21
### Added
- **Initial Release**: First release of the library with encryption, decryption, and other functionality.
