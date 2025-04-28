# Usa una imagen base de Node.js (asegurate que sea compatible con tu configuración)
FROM node:16

# Instala netcat
RUN apt-get update && apt-get install -y netcat

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y las dependencias de tu aplicación
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto que usará la aplicación (si es necesario)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["sh", "-c", "until nc -z php 9000; do sleep 1; done; npm start"]
