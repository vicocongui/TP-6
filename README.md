# TP6 - Programación Multimedial 4: Dockerizando

## Organización de las carpetas

- /frontend: Contiene todo el código frontend, que utiliza *Next.js*. Decidimos mantener el frontend en su propia carpeta para seguir una estructura clara de separación de responsabilidades.
  
- /backend: Contiene el código del servidor backend, que está basado en *Node.js* y *Express*. Lo separamos en su propia carpeta para facilitar el desarrollo y el mantenimiento independiente del frontend.

Esta organización es la más simple para proyectos full-stack, manteniendo las responsabilidades de frontend y backend separadas.

## Creación de las imágenes y docker-compose.yaml

- Para la creación de las imágenes de Docker, seguimos con la ayuda de *Dockerfiles* separados para el frontend y backend. Utilizamos comandos estándar de *Docker* como docker build para generar las imágenes.
  
- El archivo docker-compose.yaml fue armado combinando información de búsqueda en *Google, referencias a proyectos anteriores, y sugerencias de **ChatGPT* para garantizar un despliegue sencillo de ambos servicios. Usamos docker-compose para orquestar los servicios del frontend y backend en una red compartida.

## Persistencia del servicio tras el reinicio del servidor

Para garantizar que el servicio siga corriendo incluso después de un reinicio del servidor, añadimos la directiva restart: always en el archivo docker-compose.yaml para ambos servicios. Esto asegura que los contenedores de Docker se reinicien automáticamente si la instancia de AWS se reinicia o si ocurre algún fallo.

```yaml
services:
  frontend:
    restart: always

  backend:
    restart: always

## Problemas durante el desarrollo
Conexión entre frontend y backend: A pesar de lograr desplegar ambos servicios, nunca pudimos hacer que el frontend se comunique correctamente con el backend. Intentamos diferentes configuraciones en Docker Compose y ajustes de rutas, pero el frontend no lograba conectarse al backend, lo que resultaba en errores 404 o problemas de conexión. Esto afectó la funcionalidad completa de la aplicación.

Espacio insuficiente en la instancia de EC2: La instancia de EC2 se quedaba sin espacio constantemente. Intentamos liberar espacio eliminando imágenes de Docker con el comando docker system prune, pero el problema persistió. Este inconveniente hizo que los builds fallaran regularmente, complicando las pruebas y el despliegue del proyecto.

A pesar de estos problemas, logramos que el frontend esté desplegado y accesible =) , pero el backend nunca se conectó correctamente =( .