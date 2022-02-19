# @nodecfdi/credentials ChangeLog

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

