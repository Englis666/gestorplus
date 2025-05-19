# frontend/Dockerfile
FROM node:18

# Directorio dentro del contenedor
WORKDIR /app

# Copiamos sólo package.json para aprovechar cache de Docker
COPY package.json package-lock.json ./

# Instalamos dependencias dentro de la imagen
RUN npm install

# Copiamos el resto del código
COPY . .

# Puerto por defecto de React
EXPOSE 3000

# Comando para levantar la app
CMD ["npm", "start"]
