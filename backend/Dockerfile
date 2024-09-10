# Backend Dockerfile

# Usa una imagen base con Node.js
FROM node:18.17

# Define el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto en el que el backend escuchará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
