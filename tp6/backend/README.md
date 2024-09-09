# Documentación de Diseño

## Investigaciones

### Cómo guardar contraseñas de manera segura

Para cumplir con el requerimiento de guardar contraseñas de manera segura, el equipo realizó una investigación sobre técnicas de encriptación. Se optó por utilizar el algoritmo de encriptación AES (Advanced Encryption Standard) debido a que ofrece un cifrado sólido que es difícil de descifrar. Y se puede usar de forma sencilla mediante una librería.

#### Funcionamiento de AES

AES es un algoritmo de cifrado simétrico, lo que significa que utiliza la misma clave tanto para encriptar como para desencriptar los datos. Funciona mediante una serie de transformaciones matemáticas sobre bloques de datos, utilizando una clave secreta para realizar la encriptación.

### Biblioteca CryptoJS

Para implementar AES en el proyecto, se decidió utilizar la biblioteca CryptoJS, que ofrece una implementación en JavaScript de varios algoritmos de cifrado, incluido AES.

```bash
npm install crypto-js
```

#### Funcionamiento de CryptoJS

CryptoJS proporciona una interfaz sencilla para realizar operaciones de encriptación y desencriptación utilizando AES. Permite cifrar y descifrar datos de manera segura mediante el uso de claves secretas.

## Funcionalidad de la función `encriptarArchivo`

La función `encriptarArchivo` tiene como objetivo encriptar el contenido de un archivo(que es lo que va a recibir de la base de datos) utilizando el algoritmo AES y una clave secreta proporcionada por el usuario. A continuación, se detalla su funcionamiento:

1. **Lectura del archivo**: Se lee el contenido del archivo especificado por la ruta proporcionada.

2. **Encriptación del contenido**: Utilizando el algoritmo AES de CryptoJS, se cifra el contenido del archivo utilizando la clave secreta proporcionada.

3. **Escritura del contenido cifrado**: El contenido cifrado se escribe de nuevo en el mismo archivo, sobrescribiendo el contenido original.

4. **Registro de operación**: Se imprime un mensaje en la consola indicando que el archivo ha sido encriptado correctamente, junto con la ruta del archivo.

En caso de producirse algún error durante el proceso de encriptación, se captura la excepción y se muestra un mensaje de error en la consola.

## Elección de la Implementación

La implementación de encriptación utilizando AES y CryptoJS fue seleccionada debido a su solidez y facilidad de uso. AES es ampliamente reconocido por su seguridad y eficiencia, mientras que CryptoJS proporciona una implementación confiable y bien documentada del algoritmo en JavaScript.

Además, la función `encriptarArchivo` ofrece una solución simple y eficaz para encriptar el contenido de archivos de manera segura, cumpliendo con el requisito de almacenar contraseñas de forma privada y protegida.

Mediante esta implementación, se garantiza que las contraseñas almacenadas por la aplicación permanezcan seguras y privadas, brindando tranquilidad al usuario en cuanto a la confidencialidad de sus datos sensibles.

## Generación de Contraseñas Seguras

Para cumplir con la solicitud del usuario de generar contraseñas seguras, el equipo realizó una investigación sobre las características que hacen que una contraseña sea segura. Se identificaron las siguientes características mínimas:

- Longitud mínima de 12 caracteres.
- Inclusión de caracteres en minúsculas, mayúsculas, números y caracteres especiales.

Tras analizar diversas opciones y considerando las limitaciones de algunos sitios web que pueden no permitir ciertos caracteres especiales en las contraseñas, el equipo llegó a la conclusión de que una contraseña segura debería tener una longitud de al menos 16 caracteres y contener una combinación de caracteres en minúsculas, mayúsculas y números.

Esta decisión se basa en garantizar la seguridad de las contraseñas generadas, minimizando el riesgo de ataques de fuerza bruta y aumentando la complejidad de las mismas. Además, al evitar caracteres especiales, se reduce la posibilidad de problemas de compatibilidad con algunos sitios web que podrían no aceptar ciertos caracteres.

fuente: https://support.microsoft.com

## Función `generarContraseniaSegura`

La función `generarContraseniaSegura` tiene como objetivo generar contraseñas seguras que cumplan con los estándares de seguridad establecidos por el equipo. A continuación, se detalla su funcionamiento:

1. **Definición de parámetros**: La función no requiere ningún parámetro de entrada.

2. **Expresión regular de caracteres permitidos**: Se define una expresión regular (`caracteresRegEx`) que incluye caracteres alfanuméricos en minúsculas y mayúsculas. Esta expresión se utilizará para validar los caracteres generados aleatoriamente.

3. **Longitud de la contraseña**: Se establece que la longitud de la contraseña será de 16 caracteres, como se acordó con el equipo.

4. **Generación de la contraseña**: Se genera la contraseña utilizando un enfoque basado en bucles y aleatoriedad:

   - Se crea un array de longitud igual a la longitud especificada para la contraseña.
   - Se itera sobre cada elemento del array, generando un caracter aleatorio en cada iteración.
   - Se utiliza un bucle `do-while` para asegurarse de que el caracter generado cumpla con la expresión regular definida.
   - Se utiliza `String.fromCharCode` para generar un caracter aleatorio en el rango ASCII de caracteres imprimibles (33-126).
   - El bucle continúa generando caracteres hasta que se encuentre uno que cumpla con la expresión regular.
   - Una vez generados todos los caracteres, se concatenan en una cadena única utilizando el método `join`.

5. **Retorno de la contraseña generada**: La función devuelve la contraseña generada como una cadena de caracteres.

Esta implementación garantiza que la contraseña generada sea segura y cumpla con los requisitos establecidos, proporcionando así una capa adicional de seguridad para las credenciales del usuario.

## Cómo saber si mi contraseña podría estar filtrada

La API v3 de Have I Been Pwned (HIBP) proporciona una forma rápida y sencilla de buscar si una cuenta específica ha sido comprometida en una brecha de seguridad en internet. Aquí hay un resumen de cómo funciona la API

### Descripción general de la API:

La API v3 de HIBP tiene endpoints para buscar brechas de seguridad y pegados (pastes) asociados con una cuenta de correo electrónico o un dominio. También proporciona información sobre todas las brechas en el sistema y los detalles de una brecha específica. Además, ofrece acceso a la lista de contraseñas comprometidas conocida como "Pwned Passwords".

### Elección y justificación de la API:

La API v3 de HIBP fue elegida por su amplia cobertura de datos de brechas de seguridad y su facilidad de uso. Además, HIBP es ampliamente reconocido como una fuente confiable de información sobre brechas de seguridad en internet.

### Uso de la API:

1. **Registro y obtención de una clave de API**: Antes de utilizar la API, hay que registrarse en el sitio web de Have I Been Pwned y obtener una clave de API válida.

2. **Realizar consultas**: Se pueden utilizar los endpoints proporcionados por la API para buscar brechas de seguridad asociadas con una cuenta de correo electrónico o un dominio, obtener detalles sobre una brecha específica, buscar todos los paste asociados con una cuenta de correo electrónico, etc.

3. **Respuestas**: Las respuestas de la API estarán en formato JSON.

### Implementación:

1. **Consulta de brechas de seguridad**: El endpoint `GET /breachedaccount/{account}` busca todas las brechas de seguridad asociadas con una cuenta de correo electrónico.

2. **Consulta de paste**: El endpoint `GET /pasteaccount/{account}` busca todos los paste asociados con una cuenta de correo electrónico.

3. **Consulta de dominios comprometidos**: El endpoint `GET /breacheddomain/{domain}` busca todas las cuentas de correo electrónico comprometidas en un dominio específico.

4. **Consulta de detalles de una brecha específica**: El endpoint `GET /breach/{name}` obtiene detalles específicos sobre una brecha de seguridad.

#### Nota adicional sobre brechas y pastes:

En el contexto de la seguridad informática, las "brechas" se refieren a eventos en los que se comprometen datos sensibles, como contraseñas o información personal, debido a vulnerabilidades en el sistema. Por otro lado, los "pastes" son datos que se publican en internet, que pueden contener información comprometida en brechas de seguridad o recopilada ilegalmente.

## Función `verificarContraseñaComprometida`

La función `verificarContraseñaComprometida` tiene como objetivo verificar si una contraseña dada ha sido comprometida en una brecha de seguridad mediante la API de Have I Been Pwned (HIBP).

1. **Definición de parámetros**: La función toma un parámetro de entrada `contraseña` de tipo `string`, que representa la contraseña que se va a verificar.

2. **Llamada a la API de Have I Been Pwned**: Se utiliza la librería Axios para realizar una solicitud GET a la API de Have I Been Pwned, específicamente al endpoint `https://haveibeenpwned.com/api/v3/pwnedpassword/{contraseña}`. Se incluye el nombre de la aplicación en el encabezado del usuario (`user-agent`) para identificar la fuente de la solicitud (necesario).

3. **Verificación de la respuesta**: Se verifica si la respuesta de la API tiene un estado (status) igual a 200, lo que indica que la contraseña ha sido encontrada en la base de datos de contraseñas comprometidas.

4. **Retorno del resultado**: La función devuelve un valor booleano `true` si la contraseña está comprometida y `false` si no lo está.

5. **Manejo de errores**: Se utiliza un bloque try-catch para manejar cualquier error que pueda ocurrir durante la llamada a la API. En caso de error, se muestra un mensaje de error en la consola y se devuelve `false`.

Esta función proporciona una manera rápida y sencilla de verificar la seguridad de una contraseña frente a posibles brechas de seguridad en internet.

### Elección de la Implementación

La elección de la API v3 de Have I Been Pwned (HIBP) se basa en su amplia cobertura de datos de brechas de seguridad en internet, su reputación consolidada como fuente confiable de información, su facilidad de uso y su constante actualización con nuevas violaciones de datos. Esta implementación ofrece una sólida capacidad para detectar y responder a posibles violaciones de seguridad, mejorando así la seguridad y protección del usuario de la aplicación.

**Decisiones de modelado:**

Dado que el cliente especificó que se trata de una aplicación para un solo usuario y de su uso personal, el equipo comenzó definiendo dos interfaces principales: `Cuenta` y `SitioWeb`.

- `Cuenta`: Ya que representa las credenciales de acceso a un sitio web (Usuario y contraseña)
- `Sitio Web`: Contiene una lista de cuentas asociadas, ya que por cada sitio web el cliente especificó que puede tener una o más cuentas.

Para gestionar estos datos, implementamos funciones de agregar, actualizar y borrar cuentas en la base de datos, como lo pide el clinte.

**Métodos que expone el modelo:**

- `agregarCuenta`: Este método permite agregar una nueva cuenta a un sitio web existente o crear uno nuevo si no existe.
- `actualizarCuenta`: Permite actualizar la contraseña de una cuenta específica en un sitio web dado.
- `borrarCuenta`: Elimina una cuenta de un sitio web determinado.

En los comentarios de cada funcion, se detalla lo que se espera que las funcionen hagan.

**Encriptación segura de archivos:**

Para garantizar la seguridad de los datos almacenados, implementé una función `encriptarArchivo`. Esta función utiliza el algoritmo de cifrado AES para cifrar el contenido de un archivo de manera segura utilizando una clave secreta proporcionada por el usuario.

**Generación de contraseñas seguras:**

Para generar contraseñas seguras, desarrollamos una función `generarContraseniaSegura`. Esta función crea contraseñas aleatorias que cumplen con los estándares de seguridad establecidos por el equipo, asegurando una combinación de caracteres alfanuméricos.

Estas decisiones de modelado se basaron en la necesidad de garantizar la seguridad de las credenciales de los usuarios y la integridad de los datos almacenados.

**Verificación de contraseñas:**
Para implementar la verificación de contraseñas, decidimos utilizar un proceso de cron. Este proceso ejecutaría una tarea programada cada cierto tiempo (cada día) para verificar las contraseñas del usuario contra la base de datos de contraseñas comprometidas con al API haveibeenpwned.

Además, el uso de un proceso de cron permite tomar medidasen caso de que se detecten contraseñas comprometidas. La aplicación debería notificar al usuario por gmail cuando una contraseña se encuentre comprometida
