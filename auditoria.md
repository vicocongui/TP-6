# Análisis de Seguridad

## Inyección SQL en `routes/cuentas.ts`

**Tipo:** A01:2021 – Broken Access Control

### Prueba de Concepto

```typescript
const agregarCuenta = (req: Request, res: Response) => {
  const { idUsuario, nombreSitio, usuario, contrasenia } = req.body;
  const query = `INSERT INTO cuentas (idUsuario, nombreSitio, usuario, contrasenia) VALUES ('${idUsuario}', '${nombreSitio}', '${usuario}', '${contrasenia}')`;
  db.run(query, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send("Cuenta agregada");
    }
  });
};
```

**Riesgo:** Alto  
Un atacante podría modificar los parámetros de entrada para realizar inyección SQL, comprometiendo la base de datos y extrayendo, modificando o eliminando información confidencial como contraseñas.

### Recomendaciones

Se debe parametrizar las consultas SQL, usando sentencias preparadas como:

```typescript
const query = `INSERT INTO cuentas (idUsuario, nombreSitio, usuario, contrasenia) VALUES (?, ?, ?, ?)`;
db.run(query, [idUsuario, nombreSitio, usuario, contrasenia], (err) => {
  // handle response
});
```

## Exposición de datos sensibles en `db/encryption.ts`

**Tipo:** A02:2021 – Cryptographic Failures

### Prueba de Concepto

```typescript
const secretKey = "alagrandelepusecuca";
```

**Riesgo:** Alto  
El secreto de encriptación está expuesto directamente en el código, lo que permite que cualquier persona que tenga acceso al código pueda desencriptar la base de datos. Esto comprometería todas las contraseñas almacenadas en la aplicación.

### Recomendaciones

Utilizar variables de entorno para almacenar la clave secreta y asegurarse de que nunca se incluya en el repositorio de código.

## Control de acceso deficiente en `routes/cuentas.ts`

**Tipo:** A05:2021 – Security Misconfiguration

### Prueba de Concepto

```typescript
app.post("/agregarCuenta", agregarCuenta);
```

**Riesgo:** Medio  
Cualquier persona puede hacer solicitudes al endpoint `agregarCuenta` sin autenticación. Un atacante podría añadir cuentas falsas o maliciosas sin restricción.

### Recomendaciones

Implementar un sistema de autenticación (JWT, sesiones) para asegurar que solo usuarios autorizados puedan acceder a este endpoint.

## Falta de validación de entrada en `routes/cuentas.ts`

**Tipo:** A07:2021 – Identification and Authentication Failures

### Prueba de Concepto

```typescript
const { idUsuario, nombreSitio, usuario, contrasenia } = req.body;
```

**Riesgo:** Medio  
No se valida la entrada de los usuarios, lo que permite que se ingresen datos maliciosos o erróneos, potencialmente provocando inyecciones o errores de procesamiento.

### Recomendaciones

Agregar validaciones robustas para verificar que los datos de entrada cumplen con los formatos y reglas esperadas antes de procesarlos.

## Dependencias desactualizadas en `package.json`

**Tipo:** A06:2021 – Vulnerable and Outdated Components

### Prueba de Concepto

```json
"crypto-js": "^3.1.9-1",
"sqlite3": "^5.0.0",
```

**Riesgo:** Medio  
El uso de dependencias desactualizadas podría introducir vulnerabilidades conocidas en el proyecto, lo que permitiría que un atacante explote esos fallos sin tener que atacar el código directamente.

### Recomendaciones

Usar herramientas como `npm audit` para revisar y actualizar las dependencias a versiones seguras y mantenidas activamente.

## Falta de uso de HTTPS en el servidor

**Tipo:** A03:2021 – Injection

### Prueba de Concepto

```bash
http://localhost:3000/agregarCuenta
```

**Riesgo:** Alto  
La comunicación con el servidor no está encriptada. Un atacante podría interceptar y leer las contraseñas o la información de las cuentas mientras viajan por la red.

### Recomendaciones

Configurar HTTPS en el servidor para encriptar la comunicación entre cliente y servidor.

---

## Exposición de Claves Maestras en `page.tsx`

**Tipo:** Sensitive Data Exposure (A2:2021 - Cryptographic Failures)

### Prueba de Concepto

```typescript
const params: AgregarCuentaParams = {
  claveMaestra: "alagrandelepusecuca",
  usuario: nombreUsuario.toString(),
  nombreWeb: nombreCuenta.toString(),
};
```

**Riesgo:** Alto  
El uso de una clave maestra hardcodeada en el código expone datos sensibles y puede ser fácilmente accesible por atacantes. Si un atacante obtiene acceso al código fuente, podría usar esta clave para desencriptar información sensible almacenada en la base de datos.

### Recomendaciones

Los desarrolladores deben eliminar las claves hardcodeadas y usar variables de entorno seguras para almacenar este tipo de información. Además, es crucial implementar cifrado seguro para el almacenamiento y manejo de la clave.

## Faltante de Validación en el Input de Usuario en `Home.tsx`

**Tipo:** Injection (A03:2021)

### Prueba de Concepto

```typescript
const nombreUsuario = formData.get("usuario");
const nombreCuenta = formData.get("nombreWeb");
```

**Riesgo:** Medio  
No hay validación de entradas para el campo `usuario` y `nombreWeb`, lo que podría permitir la inyección de código malicioso, como ataques de SQL Injection o XSS, dependiendo del uso posterior de estas entradas.

### Recomendaciones

Agregar validaciones del lado del servidor y del cliente para asegurarse de que las entradas sean seguras y no contengan caracteres peligrosos. Además, usar prácticas seguras de escape o parametrización para evitar inyecciones.

## Exposición de Datos a través de la API en `utils.ts`

**Tipo:** Broken Access Control (A01:2021)

### Prueba de Concepto

```typescript
fetch(`${process.env.NEXT_PUBLIC_URL_API}/admin/descifrar`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

**Riesgo:** Alto  
El endpoint `/admin/descifrar` permite desencriptar la base de datos sin autenticación adecuada o controles de acceso, lo que podría permitir que cualquier usuario malicioso desencripte la base de datos.

### Recomendaciones

Implementar controles de acceso adecuados y autenticar a los usuarios antes de permitir la desencriptación de datos sensibles. Además, es recomendable limitar el acceso a estos endpoints solo a usuarios administradores.

## Manejo Incorrecto de Errores en `utils.ts`

**Tipo:** Security Misconfiguration (A05:2021)

### Prueba de Concepto

```typescript
if (!response.ok) {
  throw new Error(response.statusText);
}
```

**Riesgo:** Bajo  
No se maneja adecuadamente el caso de error en la respuesta del servidor, lo que podría llevar a fugas de información sobre el sistema a través de mensajes de error.

### Recomendaciones

Mejorar el manejo de errores proporcionando mensajes genéricos al cliente y registrando los detalles del error en el servidor para evitar revelar información sensible.
