export const ROOT_HELP = `Uso: nc-credentials <comando> [opciones]

Herramienta CLI para trabajar con certificados FIEL y CSD del SAT (@nodecfdi/credentials).

Comandos:
  data, info    Extrae información de un certificado (.cer, .pem o .pfx)
  sign          Firma texto o un archivo con una llave privada o .pfx
  verify        Verifica una firma contra un certificado, llave pública o .pfx
  pfx export    Exporta un certificado y llave privada a un archivo .pfx (PKCS#12)

Opciones globales:
  -h, --help      Muestra esta ayuda
  -v, --version   Muestra la versión del paquete

Ejecuta "nc-credentials <comando> --help" para ver las opciones de cada comando.

Códigos de salida: 0 éxito, 1 error de ejecución o firma inválida, 2 argumentos inválidos.
Cualquier opción desconocida, repetida, vacía o valor no permitido detiene la ejecución.
`;

export const DATA_HELP = `Uso: nc-credentials data [opciones]
Alias: nc-credentials info [opciones]

Extrae información de un certificado X.509 (.cer, .pem) o archivo .pfx.

Opciones:
  -c, --cer <ruta>            Ruta al archivo de certificado (.cer / .pem)
      --pfx <ruta>            Ruta al archivo .pfx / .p12
  -p, --password <texto>      Contraseña del archivo .pfx
      --password-file <ruta>  Archivo con la contraseña (o variable NODECFDI_PASSWORD)
  -f, --field <campo>         Muestra únicamente el valor de un campo específico
      --json                  Muestra la salida en formato JSON
  -h, --help                  Muestra esta ayuda

Campos disponibles para --field:
  rfc, legal-name, serial-number, serial-number-hex, serial-number-decimal,
  type, branch-name, valid-from, valid-to, valid, issuer, version, pem, pem-one-line
`;

export const SIGN_HELP = `Uso: nc-credentials sign [opciones]

Firma datos de texto, archivo o stdin usando una llave privada o archivo .pfx.

Opciones:
  -k, --key <ruta>            Ruta a la llave privada (.key / .pem)
  -c, --cer <ruta>            Ruta al certificado (.cer / .pem) opcional para validar par
      --pfx <ruta>            Ruta al archivo .pfx / .p12 (alternativa a --key)
  -p, --password <texto>      Contraseña de la llave privada o .pfx
      --password-file <ruta>  Archivo con la contraseña (o variable NODECFDI_PASSWORD)
  -d, --data <texto>          Texto a firmar
  -f, --file <ruta>           Archivo con el contenido a firmar (si se omite --data y --file, lee stdin)
  -a, --algorithm <alg>       Algoritmo de firma: sha256 (defecto), sha1, sha384, sha512, md5
  -e, --encoding <enc>        Codificación de salida: base64 (defecto), hex, binary (binary requiere --output)
  -o, --output <ruta>         Archivo donde guardar la firma, con permisos 0600 (si se omite, imprime en stdout)
      --force                 Permite sobrescribir el archivo de --output (por defecto no se sobrescribe)
  -h, --help                  Muestra esta ayuda
`;

export const VERIFY_HELP = `Uso: nc-credentials verify [opciones]

Verifica si una firma corresponde a los datos y al certificado o llave pública.

Opciones:
  -c, --cer <ruta>             Ruta al certificado (.cer / .pem)
      --public-key <ruta>      Ruta a la llave pública (.pem)
      --pfx <ruta>             Ruta al archivo .pfx / .p12
  -p, --password <texto>       Contraseña del archivo .pfx
      --password-file <ruta>   Archivo con la contraseña (o variable NODECFDI_PASSWORD)
  -d, --data <texto>           Texto original que fue firmado
  -f, --file <ruta>            Archivo con el contenido original (si se omite, lee stdin)
  -s, --signature <firma>      Firma a verificar
      --signature-file <ruta>  Archivo que contiene la firma a verificar
  -a, --algorithm <alg>        Algoritmo de firma: sha256 (defecto), sha1, sha384, sha512, md5
  -e, --encoding <enc>         Codificación de la firma: base64 (defecto), hex, binary (binary requiere --signature-file)
  -q, --quiet                  No imprime mensaje; solo usa código de salida (0 válida, 1 inválida)
  -h, --help                   Muestra esta ayuda
`;

export const PFX_HELP = `Uso: nc-credentials pfx export [opciones]

Exporta un certificado y llave privada a un archivo PFX (PKCS#12).

Opciones:
  -c, --cer <ruta>               Ruta al certificado (.cer / .pem) [requerido]
  -k, --key <ruta>               Ruta a la llave privada (.key / .pem) [requerido]
  -p, --password <texto>         Contraseña de la llave privada
      --password-file <ruta>     Archivo con la contraseña de la llave privada (o NODECFDI_PASSWORD)
      --pfx-password <texto>     Contraseña del PFX generado (por defecto usa la de la llave)
      --pfx-password-file <ruta> Archivo con la contraseña del PFX generado (o NODECFDI_PFX_PASSWORD)
  -o, --output <ruta>            Ruta del archivo .pfx de salida, con permisos 0600 [requerido]
      --force                    Permite sobrescribir el archivo de salida (por defecto no se sobrescribe)
  -a, --algorithm <alg>          Algoritmo PFX: aes128, aes192, aes256, 3des
  -h, --help                     Muestra esta ayuda
`;
