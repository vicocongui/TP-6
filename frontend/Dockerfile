# Frontend Dockerfile

# Usa una imagen base con Node.js
FROM node:18.17 AS build

# Define el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Usa una imagen base ligera para servir la aplicación
FROM nginx:alpine

# Copia los archivos construidos al directorio de nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto en el que Nginx servirá la aplicación
EXPOSE 80

# Comando para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
