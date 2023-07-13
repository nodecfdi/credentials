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

### NPM

```bash
npm i @nodecfdi/credentials --save
```

### YARN

```bash
yarn add @nodecfdi/credentials
```

### PNPM

```bash
pnpm add @nodecfdi/credentials
```

### CDN - Browser

Usa la versión mas reciente publicada cambiando `<latest-version>` por la última versión. Por ejemplo ...credentials@2.0.3/dist...

```html
<script src="https://unpkg.com/@nodecfdi/credentials@<latest-version>/dist/credentials.global.js"></script>
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

## Acerca de los archivos de certificado y llave privada

Los archivos de certificado vienen en formato `X.509 DER` y los de llave privada en formato `PKCS#8 DER`.

### Crear un objeto de certificado `Certificate`

El objeto `Certificate` no se creará si contiene datos no válidos.

El SAT entrega el certificado en formato `X.509 DER`, por lo que internamente se puede convertir a `X.509 PEM`.
También es frecuente usar el formato `X.509 DER base64`, por ejemplo, en el atributo `Comprobante@Certificado`
o en las firmas XML, por este motivo, los formatos soportados para crear un objeto `Certificate` son
`X.509 DER`, `X.509 DER base64` y `X.509 PEM`.

- Para abrir usando un archivo local: `const certificate = Certificate.openFile(filename);`
- Para abrir usando una cadena de caracteres: `const certificate = new Certificate(content);`
  - Si `content` es un certificado en formato `X.509 PEM` con cabeceras ese se utiliza.
  - Si `content` está totalmente en `base64`, se interpreta como `X.509 DER base64` y se formatea a `X.509 PEM`
  - En otro caso, se interpreta como formato `X.509 DER`, por lo que se formatea a `X.509 PEM`.

### Crear un objeto de llave privada `PrivateKey`

El objeto `PrivateKey` no se creará si contiene datos no válidos.

En SAT entrega la llave en formato `PKCS#8 DER`, por lo que internamente se puede convertir a `PKCS#8 PEM`
(con la misma contraseña).

Una vez abierta la llave también se puede cambiar o eliminar la contraseña, creando así un nuevo objeto `PrivateKey`.

- Para abrir usando un archivo local: `const key = PrivateKey.openFile(filename, passPhrase);`
- Para abrir usando una cadena de caracteres: `const key = new PrivateKey(content, passPhrase);`
  - Si `content` es una llave privada en formato `PEM` (`PKCS#8` o `PKCS#5`) se utiliza.
  - En otro caso, se interpreta como formato `PKCS#8 DER`, por lo que se formatea a `PKCS#8 PEM`.

Notas de tratamiento de archivos `DER`:

- Al convertir `PKCS#8 DER` a `PKCS#8 PEM` se determina si es una llave encriptada si se estableció
  una contraseña, si no se estableció se tratará como una llave plana (no encriptada).
- No se sabe reconocer de forma automática si se trata de un archivo `PKCS#5 DER` por lo que este
  tipo de llave se deben convertir *manualmente* antes de intentar abrirlos, su cabecera es `RSA PRIVATE KEY`.
- A diferencia de los certificados que pueden interpretar un formato `DER base64`, la lectura de llave
  privada no hace esta distinción, si desea trabajar con un formato sin caracteres especiales use `PEM`.

Para entender más de los formatos de llaves privadas se puede consultar la siguiente liga:
<https://github.com/kjur/jsrsasign/wiki/Tutorial-for-PKCS5-and-PKCS8-PEM-private-key-formats-differences>

## Leer y exportar archivos PFX

Esta librería soporta obtener el objeto `Credential` desde un archivo PFX (PKCS #12) y vicerversa.

Para exportar el archivo PFX en NodeJS:

```ts
import { Credential, PfxExporter } from '@nodecfdi/credentials';

const credential = Credential.openFiles('certificate/certificado.cer', 'certificate/private-key.key', 'password');
const pfxExporter = new PfxExporter(credential);

// Crea el binary string usando la contraseña dada
const pfxContents = pfxExporter.export('pfx-passphrase');

// Crea un base64String usando la contraseña dada
const pfxContentsb64 = pfxExporter.exportToBase64('pfx-passphrase');
```

Para leer el archivo PFX y obtener un objeto `Credential`:

```ts
import { PfxReader } from '@nodecfdi/credentials';

// Crea un objeto Credential dado el contenido de un archivo pfx
const credential = PfxReader.createCredentialFromContents('contenido-del-archivo', 'pfx-passphrase');

// Crea un objeto Credential dada la ruta de un archivo pfx
const credential = PfxReader.createCredentialsFromFile('pfxFilePath', 'pfx-passphrase');
```

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
[badge-build]: https://img.shields.io/github/actions/workflow/status/nodecfdi/credentials/build.yml?branch=main&logo=github-actions
[badge-reliability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_credentials&metric=reliability_rating
[badge-maintainability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_credentials&metric=sqale_rating
[badge-coverage]: https://img.shields.io/sonar/coverage/nodecfdi_credentials/main?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-violations]: https://img.shields.io/sonar/violations/nodecfdi_credentials/main?format=long&logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-downloads]: https://img.shields.io/npm/dm/@nodecfdi/credentials.svg?logo=npm
