# `@nodecfdi/credentials`

[![Source Code][badge-source]][source]
[![Npm Node Version Support][badge-node-version]][node-version]
[![Discord][badge-discord]][discord]
[![Latest Version][badge-release]][release]
[![Software License][badge-license]][license]
[![Build Status][badge-build]][build]
[![Reliability][badge-reliability]][reliability]
[![Maintainability][badge-maintainability]][maintainability]
[![Code Coverage][badge-coverage]][coverage]
[![Violations][badge-violations]][violations]
[![Total Downloads][badge-downloads]][downloads]

> Library to use eFirma (fiel) and CSD (sellos) from SAT

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de `@nodecfdi/credentials`

Esta librería ha sido creada para poder trabajar con los archivos CSD y FIEL del SAT. De esta forma, se simplifica el
proceso de firmar, verificar firma y obtener datos particulares del archivo de certificado así como de la llave pública.

- El CSD (Certificado de Sello Digital) es utilizado para firmar Comprobantes Fiscales Digitales.

- La FIEL (o eFirma) es utilizada para firmar electrónicamente documentos (generalmente usando XML-SEC) y está
  reconocida por el gobierno mexicano como una manera de firma legal de una persona física o moral.

Con esta librería no es necesario convertir los archivos generados por el SAT a otro formato, se pueden utilizar tal y
como el SAT los entrega.

Esta librería ha sido inspirada por la versión para php <https://github.com/phpcfdi/credentials>

## Instalación

```shell
npm i @nodecfdi/credentials --save
```

o

```shell
yarn add @nodecfdi/credentials
```

## Ejemplo básico de uso

```ts
import * as fs from "fs";
import { Credential } from '@nodecfdi/credentials';
// se puede mandar el path o el contenido
const certFile = fs.readFileSync('fiel/certificado.cer', 'binary');
const keyFile = fs.readFileSync('fiel/privatekey.key', 'binary');
const passPhrase = '12345678a'; // contraseña para abrir la llave privada
const fiel = Credential.create(certFile, keyFile, passPhrase);
const sourceString = 'texto a firmar';
// alias de privateKey/sign/verify
const signature = fiel.sign(sourceString);
console.log(signature);
// alias de certificado/publicKey/verify
const verify = fiel.verify(sourceString, signature);
console.log(verify); // boolean(true)
// objeto certificado
const certificado = fiel.certificate();
console.log(certificado.rfc()); // el RFC del certificado
console.log(certificado.legalName()); // el nombre del propietario del certificado
console.log(certificado.branchName()); // el nombre de la sucursal (en CSD, en FIEL está vacía)
console.log(certificado.serialNumber().bytes()); // número de serie del certificado
```

Para ver un ejemplo en browser checa la carpeta examples.

## Soporte

Puedes obtener soporte abriendo un ticket en Github.

Adicionalmente, esta librería pertenece a la comunidad [OcelotlStudio](https://ocelotlstudio.com), así que puedes usar los mismos canales de comunicación para obtener ayuda de algún miembro de la comunidad.

## Compatibilidad

Esta librería se mantendrá compatible con al menos la versión con
[soporte activo de Node](https://nodejs.org/es/about/releases/) más reciente.

También utilizamos [Versionado Semántico 2.0.0](https://semver.org/lang/es/) por lo que puedes usar esta librería sin temor a romper tu aplicación.

## Contribuciones

Las contribuciones con bienvenidas. Por favor lee [CONTRIBUTING][] para más detalles y recuerda revisar el archivo [CHANGELOG][].

## Copyright and License

The `@nodecfdi/credentials` library is copyright © [NodeCfdi](https://github.com/nodecfdi) - [OcelotlStudio](https://ocelotlstudio.com) and licensed for use under the MIT License (MIT). Please see [LICENSE][] for more information.

[contributing]: https://github.com/nodecfdi/credentials/blob/main/CONTRIBUTING.md
[changelog]: https://github.com/nodecfdi/credentials/blob/main/CHANGELOG.md

[source]: https://github.com/nodecfdi/credentials
[node-version]: https://www.npmjs.com/package/@nodecfdi/credentials
[discord]: https://discord.gg/AsqX8fkW2k
[release]: https://www.npmjs.com/package/@nodecfdi/credentials
[license]: https://github.com/nodecfdi/credentials/blob/main/LICENSE
[build]: https://github.com/nodecfdi/credentials/actions/workflows/build.yml?query=branch:main
[reliability]:https://sonarcloud.io/component_measures?id=nodecfdi_credentials&metric=Reliability
[maintainability]: https://sonarcloud.io/component_measures?id=nodecfdi_credentials&metric=Maintainability
[coverage]: https://sonarcloud.io/component_measures?id=nodecfdi_credentials&metric=Coverage
[violations]: https://sonarcloud.io/project/issues?id=nodecfdi_credentials&resolved=false
[downloads]: https://www.npmjs.com/package/@nodecfdi/credentials

[badge-source]: https://img.shields.io/badge/source-nodecfdi/credentials-blue.svg?logo=github
[badge-node-version]: https://img.shields.io/node/v/@nodecfdi/credentials.svg?logo=nodedotjs
[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord
[badge-release]: https://img.shields.io/npm/v/@nodecfdi/credentials.svg?logo=npm
[badge-license]: https://img.shields.io/github/license/nodecfdi/credentials.svg?logo=open-source-initiative
[badge-build]: https://img.shields.io/github/workflow/status/nodecfdi/credentials/build/main?logo=github-actions
[badge-reliability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_credentials&metric=reliability_rating
[badge-maintainability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_credentials&metric=sqale_rating
[badge-coverage]: https://img.shields.io/sonar/coverage/nodecfdi_credentials/main?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-violations]: https://img.shields.io/sonar/violations/nodecfdi_credentials/main?format=long&logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-downloads]: https://img.shields.io/npm/dm/@nodecfdi/credentials.svg?logo=npm
