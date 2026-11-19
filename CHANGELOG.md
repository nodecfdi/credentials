# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v4.0.0](https://github.com/nodecfdi/credentials/compare/v3.2.0...v4.0.0)

### Merged

- chore: support Node.js 24 in engines field [`#39`](https://github.com/nodecfdi/credentials/pull/39)

### Commits

- chore: 🚧 remove old and legacy generation of docs [`49e942d`](https://github.com/nodecfdi/credentials/commit/49e942d35c46b009d4d4ada19b29bbf2da08e4be)
- refactor: :recycle: upgrade dependencies, tooling, and build system configuration [`0e8d884`](https://github.com/nodecfdi/credentials/commit/0e8d88492c41fae30ecf0a886dc037d306ae7e65)
- chore: ⬆️ update pnpm version and supported node versions [`80a83f9`](https://github.com/nodecfdi/credentials/commit/80a83f90e9d897226381da70da8de4ab431cade7)
- refactor: 🚧 remove old and deprecated tool code and update typescript [`54389f5`](https://github.com/nodecfdi/credentials/commit/54389f59ac734779c60f4a6d06f3ebde2689c784)
- feat: :sparkles: add command line interface (CLI) support and executable [`17a6ffd`](https://github.com/nodecfdi/credentials/commit/17a6ffd6ff8e7d8b556a9cb58f6acf267113929e)
- docs: :memo: add comprehensive documentation and quick start guide [`a1cf614`](https://github.com/nodecfdi/credentials/commit/a1cf61410ec7553f7de3c5ca8a8cdfa8f1119852)
- refactor: :recycle: migrate build system from tshy to tsdown and flatten source structure [`950858c`](https://github.com/nodecfdi/credentials/commit/950858cc36c58ea62aa07f7da90c321f2d963670)
- refactor: :recycle: update node engine requirement, workspace config, and typescript settings [`12466e1`](https://github.com/nodecfdi/credentials/commit/12466e1629844cd37a0664a5162fe618c1b63db3)
- refactor: :recycle: update test imports and path aliases across unit tests [`2acef23`](https://github.com/nodecfdi/credentials/commit/2acef2326fcc36ad7a3ee77cf2e4b960f76e081e)
- refactor: :recycle: optimize cryptographic operations and refactor internal utilities [`03618a5`](https://github.com/nodecfdi/credentials/commit/03618a5c839edfc0a971350a777f3b5f9cd9f1dc)
- ci: :green_heart: add GitHub Actions workflows for CI, documentation sync, and SonarCloud analysis [`81f57b1`](https://github.com/nodecfdi/credentials/commit/81f57b1cc6efe3ec47ddf3045cba3fb253c6c396)
- refactor: :recycle: update build configuration and exports for tsdown [`ac13b9c`](https://github.com/nodecfdi/credentials/commit/ac13b9c4415f651ab326a0b80fe93840fd53c269)
- refactor: :recycle: extract helper functions in verify CLI command and clean up option validation [`06a40df`](https://github.com/nodecfdi/credentials/commit/06a40dff86521cb5f443cd51506b0a4c0bde99d3)
- refactor: :recycle: migrate from @vilic/node-forge to node-forge and handle UTF-8 certi attributes [`55e6479`](https://github.com/nodecfdi/credentials/commit/55e6479381380c6625ecd9fa744d54bf379bc043)
- test: :recycle: use test.each for private key and serial number unit tests [`ecef25a`](https://github.com/nodecfdi/credentials/commit/ecef25a935768f1b71e75aaa95fbcf3c4b9cafb5)
- test: :recycle: organize better helpers tests and update references to files on sonar [`191a606`](https://github.com/nodecfdi/credentials/commit/191a60632e08b5a4bb058fc79f421cb409dead84)
- docs: :memo: update documentation link, copyright, and license reference in README [`a9a8230`](https://github.com/nodecfdi/credentials/commit/a9a8230de8e2c05137448447ad7539a74c585307)
- refactor: :recycle: remove redundant source and test paths from sonar configuration [`bba9f7e`](https://github.com/nodecfdi/credentials/commit/bba9f7e213a85ad981af91894a1db3c1b494eee3)
- fix: :bug: update sonar exclusions to use globstar syntax [`7025f31`](https://github.com/nodecfdi/credentials/commit/7025f31613e6f6f70ea2f49ed669fe8369231818)

## [v3.2.0](https://github.com/nodecfdi/credentials/compare/v3.1.1...v3.2.0) - 2024-10-05

### Commits

- chore(release): :tada: 3.2.0 [`69e77a4`](https://github.com/nodecfdi/credentials/commit/69e77a472670392483cab508e2fc5710d317c813)
- feat: :sparkles: add missing types exported form node-forge for algorithms usage in sign [`64faf4f`](https://github.com/nodecfdi/credentials/commit/64faf4f9b055d7bafb8609a83398e36f7682346d)
- chore: :arrow_up: update dependencies [`7551e0b`](https://github.com/nodecfdi/credentials/commit/7551e0b7aeb7409078d62a01634290e88d681d4a)
- build: :construction: remove export of package.json file not necessary export [`a4bb015`](https://github.com/nodecfdi/credentials/commit/a4bb0154a653244621f22140d291551d525d7adc)

## [v3.1.1](https://github.com/nodecfdi/credentials/compare/v3.1.0...v3.1.1) - 2024-09-11

### Commits

- chore(release): :tada: 3.1.1 [`6b45e95`](https://github.com/nodecfdi/credentials/commit/6b45e95d9f3afb9776b4f57109cbd6842f6997ba)
- chore: :arrow_up: update dependencies, eslint config update to latest and usage of auto-changelog [`6ab7f27`](https://github.com/nodecfdi/credentials/commit/6ab7f270449452bf8e0f48410418cc2a7a863fca)
- docs: :memo: small change to show badge icon on build [`b2fc2a0`](https://github.com/nodecfdi/credentials/commit/b2fc2a018c350f340827ecae47e07a51d61a89a3)
- docs: :memo: update bad link to documentation [`40061eb`](https://github.com/nodecfdi/credentials/commit/40061eb162b14741b039d6117886c061bf3acb4c)

## [v3.1.0](https://github.com/nodecfdi/credentials/compare/v3.0.0...v3.1.0) - 2024-08-14

### Fixed

- feat: :sparkles: add support to change private key password [`#20`](https://github.com/nodecfdi/credentials/issues/20)

### Commits

- chore(release): :tada: 3.1.0 [`3fc0dab`](https://github.com/nodecfdi/credentials/commit/3fc0dabce8b79cd8e5544c121bb8350903b80a26)
- docs: :memo: update readme to remove old documentation of library and add new link for doc [`be72dee`](https://github.com/nodecfdi/credentials/commit/be72dee100fe76043a0aa790204782fdfeef5627)
- style: :rotating_light: resolve issues reported by sonarcloud [`a86fc87`](https://github.com/nodecfdi/credentials/commit/a86fc87e7fbe07ef7573d32d558839650a064ae2)
- refactor: :pencil2: prefer usage of forge md algorithm type [`0d0e0d5`](https://github.com/nodecfdi/credentials/commit/0d0e0d50cd766e528180682285b5739660c7314c)

## [v3.0.0](https://github.com/nodecfdi/credentials/compare/v2.0.3...v3.0.0) - 2024-08-13

### Commits

- chore: :recycle: remove old config files and configs [`6b00538`](https://github.com/nodecfdi/credentials/commit/6b00538f3d016eeb4d19b8b3001db39c290bcca4)
- docs: :memo: update docs target with latest updates in library [`8685dbf`](https://github.com/nodecfdi/credentials/commit/8685dbf7a8a90300bffc2365ac057eeab9eedc39)
- style: :rotating_light: resolve format using prettier [`ac01b4a`](https://github.com/nodecfdi/credentials/commit/ac01b4ad1387ba8dbd91d0cc2695016d4abeb31a)
- refactor: :construction: update to usage latest organization standards and conventions [`b10b724`](https://github.com/nodecfdi/credentials/commit/b10b7244b940599b0ecacc2973d47fa88ed0a209)
- chore(deps): update dependency vite to v4.5.2 [security] [`a738dd1`](https://github.com/nodecfdi/credentials/commit/a738dd10c4602229ff96982f2a88521eca6ed3e9)
- chore: :construction: update configs with latest org dependencies [`2661e8c`](https://github.com/nodecfdi/credentials/commit/2661e8c21851dcfa6ee0b13ebbcf70856c54ed51)
- docs: generate docs [`7bba40c`](https://github.com/nodecfdi/credentials/commit/7bba40c64258cc4547c12838b523abb7e214e9ea)
- chore(release): :tada: 3.0.0 [`0028b8f`](https://github.com/nodecfdi/credentials/commit/0028b8fd4eb0d2457d1e2a9838c226bded14a111)
- chore(deps): update vitest monorepo to ^0.34.0 [`dfe453d`](https://github.com/nodecfdi/credentials/commit/dfe453d3c6d3093f0c3f32d43726fdca520858d9)
- test: :test_tube: increment code coverage and small refactorings [`fa91b03`](https://github.com/nodecfdi/credentials/commit/fa91b03ff6a23e3ba77220314443e8646801de21)
- ci: :green_heart: add ci github workflows [`d9331aa`](https://github.com/nodecfdi/credentials/commit/d9331aa0f5d343d06d059b8d2e4dd5cefea84d56)
- chore: :construction: prepare exports for release version [`9b28283`](https://github.com/nodecfdi/credentials/commit/9b28283b09f0a5a420f28302947b7f41b4d2c329)
- chore(deps): update dependency typedoc to ^0.25.0 [`042ae7c`](https://github.com/nodecfdi/credentials/commit/042ae7cb063640c98c371a685fa61a36fa33fc93)
- refactor: :recycle: move from node-forge to other lib with utf8 values handled [`d0fe56e`](https://github.com/nodecfdi/credentials/commit/d0fe56e106dbd653b3ec68b8df54af5be4134934)
- docs: :memo: generate changelog using format conventional [`1b76d65`](https://github.com/nodecfdi/credentials/commit/1b76d6587ba009c0f7ffd40db9d7a157ca649312)
- chore: :arrow_up: update dependencies [`4accedc`](https://github.com/nodecfdi/credentials/commit/4accedcce9623afe68e3c58f9d3c999dc43acfb3)

## [v2.0.3](https://github.com/nodecfdi/credentials/compare/v2.0.2...v2.0.3) - 2023-07-13

### Merged

- chore: version bump 2.0.3 [`#19`](https://github.com/nodecfdi/credentials/pull/19)

### Commits

- docs: generate docs [`287e21d`](https://github.com/nodecfdi/credentials/commit/287e21d15cb3003f6bb8ebb8b4718fbb5356cfe6)
- fix: exports for node-forge and esm imports [`5b97c82`](https://github.com/nodecfdi/credentials/commit/5b97c82a00dbe2a2357a8be7d4723b3a4cf755b3)

## [v2.0.2](https://github.com/nodecfdi/credentials/compare/v2.0.1...v2.0.2) - 2023-07-13

### Merged

- chore: version bump 2.0.2 [`#18`](https://github.com/nodecfdi/credentials/pull/18)

### Commits

- docs: generate docs [`ef7a2bb`](https://github.com/nodecfdi/credentials/commit/ef7a2bb3edc86840e541c5fff329bb1784d973ba)
- chore: update deps missing [`76fa262`](https://github.com/nodecfdi/credentials/commit/76fa2628fd399dbfaa60b44046185e5b80dc3500)

## [v2.0.1](https://github.com/nodecfdi/credentials/compare/v2.0.0...v2.0.1) - 2023-07-11

### Merged

- chore: version 2.0.1 [`#17`](https://github.com/nodecfdi/credentials/pull/17)

### Commits

- docs: generate docs [`fdb2bb4`](https://github.com/nodecfdi/credentials/commit/fdb2bb4b6ce8a27f7b12c34338355f34084ed5a9)
- style: apply eslint fixes [`95d6d25`](https://github.com/nodecfdi/credentials/commit/95d6d2527da521a8f17458b7f55b986a5e31b725)
- style: apply prettier fixes [`aecd7e6`](https://github.com/nodecfdi/credentials/commit/aecd7e652e6c79f34fb70b3a013b082b2fde326a)
- chore(deps): update vitest monorepo to ^0.33.0 [`7a23c7c`](https://github.com/nodecfdi/credentials/commit/7a23c7c39887cedb706ef0047d5fb6e920207459)
- fix: resolve problem with usage on module scripts for node-forge commonjs [`b8b53e9`](https://github.com/nodecfdi/credentials/commit/b8b53e919e69a3efb292a540011a85b45d78eaca)
- chore: version bump 2.0.1 [`ba54f66`](https://github.com/nodecfdi/credentials/commit/ba54f66e70dd19bed8b673f67cc66f19e0844d14)
- fix: error reported by sonarcloud on regex [`d94077f`](https://github.com/nodecfdi/credentials/commit/d94077faafb25bf06785fe097bf2d84b85818a32)
- ci: more readable jobs [`dfb77a8`](https://github.com/nodecfdi/credentials/commit/dfb77a83a8817fc7be39fb53da3a7bb67571b808)

## [v2.0.0](https://github.com/nodecfdi/credentials/compare/v1.3.0...v2.0.0) - 2023-06-30

### Merged

- version bump 2.0.0 [`#14`](https://github.com/nodecfdi/credentials/pull/14)
- chore(deps): update dependency typedoc-theme-hierarchy to v3 [`#5`](https://github.com/nodecfdi/credentials/pull/5)
- chore(deps): update dependency jest-watch-typeahead to v2 [`#4`](https://github.com/nodecfdi/credentials/pull/4)

### Commits

- refactor: move from jsrsasign to node-forge for handle certs and pems [`274e6f8`](https://github.com/nodecfdi/credentials/commit/274e6f81c83ee83d1394a32c6e7ab80836db41b2)
- refactor: move again to ts-mixer for handler best protected access [`2f1f08c`](https://github.com/nodecfdi/credentials/commit/2f1f08cb9a1ea660e41b8b45406192516d47fd0e)
- chore: increment test coverage and added missing tests [`b79c7a3`](https://github.com/nodecfdi/credentials/commit/b79c7a32ebc7339eab2ece2398fdbeaf224fc8ca)
- ci: update with latest changes on github and added support to node lts and next [`f97eece`](https://github.com/nodecfdi/credentials/commit/f97eece1f21efb3c4505719077e444b98eb0690f)
- refactor: remove old config files [`07583c2`](https://github.com/nodecfdi/credentials/commit/07583c28f0718e23108c02c01a20c4dbaf3bb1c2)
- feat: added support to pfx [`11d9ec2`](https://github.com/nodecfdi/credentials/commit/11d9ec22928c84eaa68abbaded2b4b8e4f688216)
- style: apply linter and formatter fixes and remove unused libraries [`62503be`](https://github.com/nodecfdi/credentials/commit/62503be39af8c8a77ce88a013c93cd44c09aad65)
- docs: generate docs [`2d64cf4`](https://github.com/nodecfdi/credentials/commit/2d64cf4f1a95dbae6e7bf5219778e3ea61253c86)
- docs: update readme with pfx usage [`797d07e`](https://github.com/nodecfdi/credentials/commit/797d07e083e36f91f0e0796cb923762723d4d903)
- docs: update example to credentials [`c2ba178`](https://github.com/nodecfdi/credentials/commit/c2ba1784abcd1ca034685f6e98dfdcef1238d2fe)
- docs: update with latest changes, fixed badges and update installation [`699fa7f`](https://github.com/nodecfdi/credentials/commit/699fa7f5e41beea016ccbcc1a4abbb1c11d27da5)
- chore: version bump 2.0.0 [`fdb2eb9`](https://github.com/nodecfdi/credentials/commit/fdb2eb946b8bfbb24fdcc80495bd59f06be1feef)
- ci: fix for pnpm version 8 support install [`056ff05`](https://github.com/nodecfdi/credentials/commit/056ff050bd0b522f58be1e926839f8c2024ae64d)
- chore(deps): update pnpm/action-setup action to v2.2.4 [`4a611cb`](https://github.com/nodecfdi/credentials/commit/4a611cb8cbaec898f971261766cddcc4bc7cc91d)
- ci: fixed running build workflow [`226ba43`](https://github.com/nodecfdi/credentials/commit/226ba43f37969d71527d163b720b65b28a29a978)
- chore: update license 2023 happy new year [`dc221f0`](https://github.com/nodecfdi/credentials/commit/dc221f0c51cfde0271ba76472fa463a2f7a7710e)
- Delete CNAME [`a1f614f`](https://github.com/nodecfdi/credentials/commit/a1f614fccd750aab47e863f14b86a1feff7d9279)
- Create CNAME [`ba5927b`](https://github.com/nodecfdi/credentials/commit/ba5927bd488f0c66f6c83cd84af905f55d44870c)

## [v1.3.0](https://github.com/nodecfdi/credentials/compare/v1.2.2...v1.3.0) - 2022-07-08

### Merged

- Version 1.3.0 [`#2`](https://github.com/nodecfdi/credentials/pull/2)

### Commits

- chore: update new configs [`dbcc9a4`](https://github.com/nodecfdi/credentials/commit/dbcc9a4f67b2bd5127080843ebf520ff100e71cd)
- docs: added docs for next release v1.3.0 [`8596346`](https://github.com/nodecfdi/credentials/commit/859634690d3048e276d98b032487b11a624799fc)
- refactor: remove old docs and old configs [`5301307`](https://github.com/nodecfdi/credentials/commit/53013079dc36dbe3c53eec55c1b0ebace2f817ac)
- test: increment coverage, and refactor with new eslint and prettier rules [`9550ee7`](https://github.com/nodecfdi/credentials/commit/9550ee7a03215d5e89ead4e87963caac1bfbf6c6)
- refactor: apply linter fixes, missing sign algorithm and small fixes [`50aec1d`](https://github.com/nodecfdi/credentials/commit/50aec1d9f932781fea5370c0d5b3e64f81cec63a)
- docs: update readme with missing doc and added browser example [`1e20d7c`](https://github.com/nodecfdi/credentials/commit/1e20d7cf21576afd77c01648814a4be8b2f0c584)
- ci: added build workflow and sonarcloud for better quality code [`2d256fe`](https://github.com/nodecfdi/credentials/commit/2d256fee1515c68f439c9a2a8fc7357dd009245d)
- docs: update docs and added missing code of conduct and contributing [`41cfe6c`](https://github.com/nodecfdi/credentials/commit/41cfe6c8441c74c21a0093cbbf4e3c668d0046ad)
- chore: added husky, changeset and vscode DEBUG [`d67ac0e`](https://github.com/nodecfdi/credentials/commit/d67ac0e3a0a0add997b1546efc1aad789ad8057f)
- chore(deps): update deps [`413ba3b`](https://github.com/nodecfdi/credentials/commit/413ba3be7bc0b7059d91f656a671aa0654ea79ec)
- chore: version bump 1.3.0 [`f9e5994`](https://github.com/nodecfdi/credentials/commit/f9e59943679d9015b49fecf03c128bbfa330ea08)
- fix: remove links on comment for doc generation [`2c72b56`](https://github.com/nodecfdi/credentials/commit/2c72b56461d7a7d91b10b2f8ac21fb5da14164b8)
- refactor: remove unused interface and update error [`0786e0b`](https://github.com/nodecfdi/credentials/commit/0786e0b4a506886fde3a2d27b585b221dc8a278a)
- chore(deps): update typedoc [`d9f9c7d`](https://github.com/nodecfdi/credentials/commit/d9f9c7de7d7246668ce702f606cd0d794bc63076)
- build: define externals for generation of library [`451d634`](https://github.com/nodecfdi/credentials/commit/451d6343b66fedb538c2be045d93ae9e1b5144f4)

## [v1.2.2](https://github.com/nodecfdi/credentials/compare/v1.2.1...v1.2.2) - 2022-03-14

### Commits

- docs: update docs for release version 1.2.2, revert changes for support teletex strings [`2a9cd45`](https://github.com/nodecfdi/credentials/commit/2a9cd45467fdc3dccfdf1ef07bcab735fe0da834)
- refactor: revert change of certificate for support teletex string, jsrsasign support native [`31070c8`](https://github.com/nodecfdi/credentials/commit/31070c8c21de4e4a33fed9f38a21983f00951871)

## v1.2.1 - 2022-03-10

### Commits

- docs: prepare docs for release version 1.1.0 [`7808409`](https://github.com/nodecfdi/credentials/commit/78084092123caccc6a6564a45b10b7b1d3c2a34c)
- chore: initial commit [`de94ded`](https://github.com/nodecfdi/credentials/commit/de94ded9a5be3ad4e05e6f3a568fae3dffc421c6)
- docs: prepare docs for release version 1.2.1 [`3d839bd`](https://github.com/nodecfdi/credentials/commit/3d839bdfecd57fbe1b9fbd041bb21833cf1fe90c)
- chore: added more rules to eslint and prettier and update dependencies [`ff88b8c`](https://github.com/nodecfdi/credentials/commit/ff88b8c3ff1084fce1be6d7a55e5cf15070eb76b)
- docs: updated document files for target 1.2.0 [`258440b`](https://github.com/nodecfdi/credentials/commit/258440b8fe7c0fe055ad6b44da484875a4b34919)
- fix: compatibility with openssl sign and verify different returns (hexadecimal) no binary [`44b4483`](https://github.com/nodecfdi/credentials/commit/44b4483f51fa7251b6e8a5d46ab3d84349b9406a)
- fix: added support to certificate with TeletexString [`cd8f182`](https://github.com/nodecfdi/credentials/commit/cd8f1827e06a5917c41940e82b8d696379362d5d)
- chore: added GitHub actions workflow [`74d0abf`](https://github.com/nodecfdi/credentials/commit/74d0abfcb4b5a4552ea779a42b347c642ff74b9d)
- chore: updated workflow with schedule and remove unused code [`a2d12eb`](https://github.com/nodecfdi/credentials/commit/a2d12ebbda458c2b90028914e8d989f105cf1006)
- test: fixes to work on Windows [`4dd010a`](https://github.com/nodecfdi/credentials/commit/4dd010acf17d7a2413c795ad4dced653241ebae5)
- test: fix line endings, replace all crlf to lf [`008d381`](https://github.com/nodecfdi/credentials/commit/008d381bdfb5192d84aaf8cad490b1fdf47bcf05)
