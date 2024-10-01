# Changelog

## [Unreleased] - 2024-10-01

### Added
- New tests for the following utilities:
  - `./utils/color`: 100% coverage
  - `./utils/colorDepth`: 100% coverage
  - `./utils/elliptic`: 100% coverage
  - `./config/config`: 100% coverage

### Tests
- Enhanced test coverage across utility and configuration files, achieving full coverage for the specified functions.

## [1.1.2] - 2024-09-30
### Changed
- I encountered an issue with the `workflow`, where version **1.1.1** uploaded through the `workflow` had no compiled files. Therefore, I updated the version and uploaded it to npm myself
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
