# @nodecfdi/credentials ChangeLog

## 2.0.0

### Major Changes - PFX and Refactor to node-forge

- Added support to pfx and pkcs12.
- Refactor certificate handler lib from `jsrsasign` to `node-forge` for add support to pkcs12.
- Updated example for browser usage with latest credentials release.
- Changed microbundle to tsup for generation of library.
- Fix declarations types for target import or require.
- Remove unused code and library imports.
- Added test for browser environment.
- Update dependencies.
- Update CI workflow for fix pipeline to latest github changes.

#### Breaking Change

- Change sign method output from hexadecimal string to binary string like a `phpcfdi/credentials`.
- Drop support to node versions < 16

## 1.3.0

### Minor Changes

- Feature added specific algorithm on sign and verify from credential, private key and public key.
- Added example for browser usage.
- Resolve dependencies for Browser and NodeJS usage.

### CI

- Added workflow build for use pnpm and updated source files for better coverage.
- Added Sonarcloud for better quality code.

### Build

- Changed from rollup to microbundle for generation of library.

## 1.2.2

- Updated dependencies
- Revert changes on certificate thanks to `jsrsasign` added support native teletex string

## 1.2.1

- Updated dependencies
- Added more rules to eslint and prettier (quality code)
- Added test for certificate with TeletexStrings, and support to TeletexString

## 1.2.0

Add OpenSSL compatibility: sign and verify

- Updated methods sign and verify on private key, public key and credential.
- Update signature algorithm, remove unused algorithms.
- Compatibility with open ssl verify and sign expected but not return binary, return hexadecimal

There are some soft backwards incompatibility changes

- Method sign of class PrivateKey now use different Signature algorithms and return hexadecimal signature
- The parameter algorithm of PublicKey.verify() removed for not used.
- Update methods sign and verify on Credential to target public and private key.

## 1.1.0

- Added support to browser and node environments
- Added ES6 and Rollup support
- Updated dependencies
- Updated license 2022
- Added RFC4514

## 1.0.1

- Fix bad typescript definition KJUR.lang
- Better test and document files

## 1.0.0

- First release
