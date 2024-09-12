1. **Cómo organizaron las carpetas entre todos los proyectos**
   
   Organizamos las carpetas siguiendo una estructura modular para facilitar el desarrollo y la implementación de cada parte del proyecto. Creamos una carpeta raíz para el proyecto general y, dentro de esta, subcarpetas para cada servicio como "frontend", "backend" y "database". Esto nos permitió trabajar de manera independiente en cada componente y mantener una separación clara de responsabilidades.

   **Justificación**: Esta estructura modularizada facilita la comprensión del proyecto y evita confusiones, especialmente cuando se trabaja con múltiples equipos. Además, permite automatizar la creación de imágenes Docker para cada servicio por separado, lo que resulta más eficiente para pruebas y despliegue.

2. **Cómo hicieron para armar las imágenes y el docker-compose.yaml**
   
   Para armar las imágenes y el archivo `docker-compose.yaml`, utilizamos una combinación de recursos. Comenzamos investigando en Google y consultando documentación oficial de Docker para entender cómo construir imágenes personalizadas y configurar docker-compose. También utilizamos ChatGPT para obtener ejemplos y recomendaciones sobre cómo optimizar la configuración para nuestra arquitectura particular. Con esa base, escribimos los archivos desde cero, ajustándolos a las especificaciones de nuestra aplicación.

3. **Cómo hicieron para que el servicio siga andando aun si se reinicia el servidor**
   
   Para garantizar que los servicios se reinicien automáticamente después de un reinicio del servidor, agregamos la opción `restart: always` en el archivo `docker-compose.yaml`. Esta configuración permite que Docker supervise los contenedores y los vuelva a levantar en caso de un fallo o reinicio del servidor. También configuramos los servicios para ejecutarse como demonios, lo que asegura que permanezcan en segundo plano.

4. **Cualquier problema interesante que hayan tenido**
   
   Uno de los problemas más interesantes que enfrentamos fue la gestión de dependencias entre los servicios. Por ejemplo, el backend dependía de la base de datos para iniciar correctamente, y al principio no habíamos configurado correctamente la secuencia de inicio. Esto causaba que el backend intentara conectarse a la base de datos antes de que esta estuviera lista, lo que generaba errores de conexión. Lo resolvimos utilizando la opción `depends_on` en `docker-compose` para asegurarnos de que los servicios se inicien en el orden correcto.

   Otro desafío fue con las variables de entorno, ya que al principio las habíamos codificado directamente en el archivo `docker-compose.yaml`. Posteriormente, decidimos moverlas a un archivo `.env` para hacer la configuración más segura y flexible, especialmente para despliegues en diferentes entornos (desarrollo, producción).
