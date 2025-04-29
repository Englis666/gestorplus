Guía de Usuario para Docker - GestorPlus

Este manual está diseñado para que los usuarios aprendan cómo instalar, iniciar y manejar Docker para ejecutar el backend y otros servicios relacionados con GestorPlus.
1. Instalar Docker
En Windows:

    Dirígete a Docker Desktop para Windows.

    Descarga e instala el archivo ejecutable.

    Sigue las instrucciones del asistente de instalación.

    Después de la instalación, abre Docker Desktop y asegúrate de que esté en ejecución.

En Mac:

    Dirígete a Docker Desktop para Mac.

    Descarga el archivo .dmg e instala Docker.

    Abre Docker Desktop y asegúrate de que esté en funcionamiento.

En Linux (Ubuntu):

    Actualiza tu sistema:

sudo apt-get update
sudo apt-get upgrade

Instala Docker:

sudo apt install docker.io

Inicia el servicio de Docker:

sudo systemctl start docker
sudo systemctl enable docker

Verifica que Docker esté corriendo:

    sudo docker --version

En Linux (Arch Linux):

    Actualiza tu sistema:

sudo pacman -Syu

Instala Docker:

sudo pacman -S docker

Inicia el servicio de Docker:

sudo systemctl start docker
sudo systemctl enable docker

Verifica que Docker esté corriendo:

    sudo docker --version

2. Iniciar Docker
Comando para iniciar el servicio de Docker:

Si Docker no está corriendo, puedes iniciar el servicio con el siguiente comando:
En Linux:

sudo systemctl start docker

En Windows y Mac:

    Abre Docker Desktop y espera a que el icono en la bandeja del sistema cambie a verde, indicando que Docker está en ejecución.

3. Comandos Básicos para Manejar Docker
3.1. Verificar el Estado de Docker

Para verificar que Docker está funcionando correctamente, ejecuta el siguiente comando:

docker info

3.2. Ver Contenedores Activos

Para listar todos los contenedores en ejecución:

docker ps

Si quieres ver todos los contenedores (incluso los detenidos):

docker ps -a

3.3. Ejecutar un Contenedor para GestorPlus

Para ejecutar el contenedor de GestorPlus con una base de datos MySQL y un servidor PHP, usa:

docker-compose up -d

Esto levantará los contenedores definidos en el archivo docker-compose.yml para GestorPlus.
3.4. Detener un Contenedor

Para detener un contenedor en ejecución:

docker stop <nombre_o_id_del_contenedor>

3.5. Eliminar un Contenedor

Para eliminar un contenedor detenido:

docker rm <nombre_o_id_del_contenedor>

3.6. Ejecutar Comandos Dentro de un Contenedor

Si deseas ejecutar un comando dentro de un contenedor en ejecución:

docker exec -it <nombre_o_id_del_contenedor> <comando>

Por ejemplo, para acceder a un contenedor y abrir una terminal de Bash:

docker exec -it gestorplus_php bash

4. Uso de Docker Compose para GestorPlus

Docker Compose permite gestionar varios contenedores de GestorPlus de manera eficiente.
4.1. Instalar Docker Compose

Si no tienes Docker Compose instalado, puedes instalarlo con los siguientes comandos:
En Linux:

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

Verifica la instalación:

docker-compose --version

4.2. Ejemplo de Docker Compose para GestorPlus

Crea un archivo docker-compose.yml en el directorio raíz del proyecto para definir los servicios de GestorPlus:

version: '3'
services:
  gestorplus_backend:
    image: php:8.0-apache
    ports:
      - "80:80"
    volumes:
      - ./gestorplus:/var/www/html
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: gestorplus
      MYSQL_DATABASE: gestorplus_db
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:

Para iniciar los servicios, usa:

docker-compose up -d

Para detener los servicios:

docker-compose down

5. Recursos Adicionales

    Documentación Oficial de Docker: https://docs.docker.com

    Docker Hub: https://hub.docker.com (para encontrar y compartir imágenes de Docker)

6. Solución de Problemas

    Docker no arranca: Asegúrate de que el servicio de Docker esté en ejecución y que tu firewall no esté bloqueando el puerto 2375.

    Contenedor no arranca: Revisa los logs del contenedor con:

docker logs <nombre_o_id_del_contenedor>
