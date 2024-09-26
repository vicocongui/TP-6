# Proyecto: Gestor de Contraseñas - Proceso de Desarrollo

Este es un resumen detallado de los pasos y decisiones clave durante el desarrollo del proyecto de gestor de contraseñas.

## Estado de la Base de Datos

Al iniciar, confirmamos que la base de datos estaba corrupta. La falla estaba en que los datos se introducían con comillas simples en lugar de dobles. Una vez solucionado, la estructura básica estaba funcional, lo cual fue el punto de partida para empezar a arreglar la lógica de encriptación y desencriptación.

## Encriptación de la Base de Datos

La base de datos se encripta correctamente utilizando métodos de encriptación con CryptoJS. Sin embargo, surgió un problema: una vez encriptada, nunca se volvía a utilizar la versión encriptada, generando una falta de seguridad. La base de datos debía operar completamente en modo encriptado.

### Uso Incorrecto de la Base de Datos Desencriptada

En lugar de alternar entre la base de datos encriptada y desencriptada según la necesidad, el sistema siempre usaba la base de datos desencriptada, desvirtuando el propósito de la encriptación y exponiendo los datos sensibles.

### Falta de Funciones para Desencriptar la Base de Datos

A pesar de tener métodos para encriptar los datos, no había funciones para desencriptar la base de datos, lo cual impedía utilizar los datos encriptados de manera eficiente.

**Solución planteada**: Aunque existían funciones moldeadas por ChatGPT, estas no estaban completamente integradas ni probadas, lo que llevó a optimizar el manejo seguro de contraseñas.

## Limpieza de Código

El backend contenía mucho código innecesario y de prueba, lo que dificultaba la eficiencia del trabajo. Fue necesario limpiar el código para mantener un sistema más claro, eficiente y mantenible.

## Investigación: SQLCipher vs CryptoJS

Durante el proceso, evaluamos SQLCipher como alternativa para encriptar la base de datos completa.

### Beneficios de SQLCipher:

- **Encriptación total**: Encripta toda la base de datos, incrementando la seguridad general.
- **Transparencia**: Cifra y descifra la base de datos automáticamente, simplificando la implementación.
- **Seguridad avanzada**: Es una solución robusta y ampliamente utilizada.
- **Soporte multiplataforma**: Facilita la integración en distintos entornos.

### Desventajas de SQLCipher:

- **Costo**: La implementación bettersqlite + SQLCipher es paga. Buscamos versiones gratuitas, pero solo encontramos una versión no oficial con solo 7 descargas.
- **Complejidad**: Es una implementación de alta complejidad.

### Decisión Final: CryptoJS

Decidimos no usar SQLCipher y continuar con CryptoJS, ya integrado en nuestro proyecto.

## Modificación de Endpoints

Se realizaron modificaciones en los endpoints para adaptar el sistema al flujo correcto de encriptación y desencriptación.

### Endpoints creados y sus funciones:

- **agregarCuenta (POST)**: Permite agregar una nueva cuenta. Encripta la contraseña con AES antes de almacenarla en la base de datos.
- **consultarListado (POST)**: Obtiene todas las cuentas almacenadas, desencripta las contraseñas y verifica si alguna ha sido comprometida usando la API de Have I Been Pwned. El campo `estadoContrasenia` en la interfaz `Cuenta` muestra el resultado.
- **borrarCuenta (DELETE)**: Elimina una cuenta específica basada en el nombre de la web y el usuario.
- **actualizarCuenta (PUT)**: Actualiza la contraseña de una cuenta existente. La nueva contraseña se encripta antes de reemplazar la antigua en la base de datos.

## Funcionalidad Adicional: Have I Been Pwned (HIBP)

Se añadió una funcionalidad importante para mejorar la seguridad: la verificación de contraseñas mediante la API de Have I Been Pwned.

### verificarContrasenaEnHaveIBeenPwned

Esta función verifica si una contraseña ha sido expuesta en alguna violación de datos. El campo `estadoContrasenia` de la interfaz `Cuenta` se usa para almacenar y mostrar el resultado, indicando si una contraseña está comprometida o no.

### Cómo funciona Have I Been Pwned:

La versión gratuita usa SHA-1. Se envían los primeros 5 caracteres del hash a la API de HIBP y se comparan los resultados devueltos con el resto del hash para determinar si la contraseña ha sido comprometida.

### Cómo lo utilizamos en nuestro proyecto:

**Integración de la Verificación de Contraseñas en el Proceso de Agregar/Actualizar Cuenta**

Esta verificación se ha integrado en los procesos de agregar y actualizar cuentas. Cada vez que el usuario intenta ingresar una nueva contraseña, ya sea para agregar o actualizar una cuenta, la función `verificarContrasenaComprometida` se invoca antes de realizar la acción.

## Uso de la API desde el Frontend

El frontend, desarrollado en **Next.js**, interactúa con el backend utilizando **Axios**, una librería para realizar peticiones HTTP. La lógica principal reside en la carga de un listado de cuentas después de que el usuario introduce una clave maestra. El hook `useEffect` ejecuta el llamado a la API, mientras que la función `consultarListado` en el archivo `utils.ts` gestiona la petición.

El backend está alojado en la URL base `http://18.221.157.177:3000/v1` y ofrece los siguientes endpoints, consumidos desde funciones en `utils.ts`:

- **Agregar cuenta (POST /listado/add-account)**: Permite agregar una nueva cuenta.
- **Consultar listado (POST /listado)**: Devuelve un listado de cuentas asociadas a la clave proporcionada.
- **Actualizar cuenta (PUT /usuario/update)**: Actualiza los datos de una cuenta específica.
- **Borrar cuenta (DELETE /usuario/delete)**: Elimina una cuenta basada en la clave, usuario y nombre de la web.

### Axios

Utilizamos **Axios** por las siguientes ventajas:

- Configuración de interceptores para manejar errores centralizadamente.
- Promesas que permiten un manejo asincrónico simple.
- Compatibilidad con TypeScript, lo que asegura un código tipado y seguro.

## DaisyUI

Este proyecto utiliza **DaisyUI** como complemento de **TailwindCSS** para darle un estilo visual moderno y responsive. DaisyUI facilita la creación de componentes UI estéticamente agradables con clases predefinidas, reduciendo el tiempo de desarrollo.

## Arquitectura de la Página Home (page.tsx)

La página principal (`page.tsx`) está estructurada para mostrar una lista paginada de cuentas, además de proporcionar botones para agregar, actualizar o eliminar cuentas.

### Estados Principales:

- **claveMaestra**: Guarda la clave maestra ingresada por el usuario.
- **formulario**: Maneja los mensajes de error.
- **listadoCuentas**: Almacena las cuentas obtenidas desde el backend.
- **paginaActual**: Controla la paginación del listado.

### Paginación

La paginación está determinada por el estado `paginaActual` y la constante `ELEMENTOS_POR_PAGINA`. Se calcula la página actual y se renderizan las cuentas correspondientes.

### Redirección de Páginas

Utilizando el hook `useRouter` de **Next.js**, se implementan redirecciones simples hacia las rutas de agregar, actualizar y borrar.

### Consideraciones Adicionales:

- **Seguridad**: Se maneja una clave maestra que actúa como método de autenticación. Se recomienda implementar mejores prácticas de seguridad, como tokens JWT o autenticación basada en OAuth.
- **Manejo de Errores**: Se han implementado mensajes de error que informan al usuario si ocurre algún fallo en la comunicación con el backend o durante la manipulación de las cuentas.
