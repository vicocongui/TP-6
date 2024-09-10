# Frontend Dockerfile

# Usa una imagen base con Node.js
FROM node:20 AS build

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

# Expone el puerto en el que Nginx servirá la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]

