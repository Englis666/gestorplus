FROM node:16

RUN apt-get update && apt-get install -y netcat

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expone el puerto que usará la aplicación (si es necesario)
EXPOSE 3000

CMD ["sh", "-c", "until nc -z php 9000; do sleep 1; done; npm start"]
