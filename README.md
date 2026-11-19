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

Esta librería ha sido inspirada por la versión para php https://github.com/phpcfdi/credentials

## Documentación

La documentación está disponible en el sitio web [NodeCfdi](https://nodecfdi.com/librarys/credentials/getting-started)

## Uso por línea de comandos (CLI)

Al instalar el paquete se incluye el ejecutable `nc-credentials` (o puedes ejecutarlo con `npx nc-credentials`):

```bash
# Obtener datos de un certificado (RFC, razón social, serie, vigencia, etc.)
nc-credentials data --cer certificate.cer
nc-credentials data --cer certificate.cer --json
nc-credentials data --cer certificate.cer --field rfc
nc-credentials data --cer certificate.cer --field legal-name

# Firmar texto o archivo
nc-credentials sign --cer certificate.cer --key private_key.key --password-file password.txt --data "cadena original"
nc-credentials sign --key private_key.key --password-file password.txt --file documento.txt --output firma.b64

# Verificar una firma
nc-credentials verify --cer certificate.cer --data "cadena original" --signature "<firma-base64>"
nc-credentials verify --cer certificate.cer --file documento.txt --signature-file firma.b64

# Exportar a archivo PFX (PKCS#12)
nc-credentials pfx export --cer certificate.cer --key private_key.key --password-file password.txt --output archivo.pfx
```

Ejecuta `nc-credentials --help` o `nc-credentials <comando> --help` para ver todas las opciones disponibles (incluyendo soporte para `--pfx`, `stdin`, `--encoding` y `NODECFDI_PASSWORD`).

Notas de seguridad y validación:

- Prefiere `--password-file` o la variable `NODECFDI_PASSWORD` en lugar de `--password`, que expone la contraseña en la lista de procesos (el CLI emite una advertencia).
- Las opciones desconocidas, repetidas, vacías, argumentos sobrantes o valores no permitidos detienen la ejecución indicando el valor inesperado.
- Los archivos de salida (`--output`) se crean con permisos `0600` y no se sobrescriben salvo que uses `--force`.
- Los datos se firman byte a byte (texto en UTF-8); `--encoding binary` requiere `--output` al firmar y `--signature-file` al verificar.
- Códigos de salida: `0` éxito, `1` error de ejecución o firma inválida, `2` argumentos inválidos.

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

[contributing]: https://github.com/nodecfdi/.github/blob/main/docs/CONTRIBUTING.md
[changelog]: https://github.com/nodecfdi/credentials/blob/main/CHANGELOG.md
[source]: https://github.com/nodecfdi/credentials
[node-version]: https://www.npmjs.com/package/@nodecfdi/credentials
[discord]: https://discord.gg/AsqX8fkW2k
[release]: https://www.npmjs.com/package/@nodecfdi/credentials
[license]: https://github.com/nodecfdi/credentials/blob/main/LICENSE.md
[build]: https://github.com/nodecfdi/credentials/actions/workflows/build.yml?query=branch:main
[reliability]: https://sonarcloud.io/component_measures?id=nodecfdi_credentials&metric=Reliability
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
