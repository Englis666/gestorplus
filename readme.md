# GestorPlus

GestorPlus es una plataforma integral para la gestión de talento humano, procesos administrativos y comunicación interna en organizaciones. Incluye módulos para ausencias, vacaciones, convocatorias, publicaciones, notificaciones, chat interno, y más.

---

## Características principales

- Gestión de usuarios y roles
- Módulo de ausencias y vacaciones
- Convocatorias y postulaciones
- Publicaciones internas
- Notificaciones automáticas
- Chat interno entre usuarios
- Panel administrativo
- API basada en acciones (tipo `?action=...`)
- Frontend en React
- Backend en PHP (MVC)
- Base de datos MariaDB/MySQL
- Despliegue con Docker y Docker Compose
- Soporte para archivos y carga de imágenes
- Sistema de autenticación con JWT

---

## Instalación rápida (recomendado)

Puedes instalar y configurar GestorPlus automáticamente usando el script interactivo:

```bash
bash install-gestorplus.sh
```

Este script:

- Verifica dependencias (Docker, Docker Compose, Node.js, etc.)
- Clona el repositorio si es necesario
- Instala dependencias del frontend
- Levanta los servicios con Docker Compose (dev o prod)
- Permite importar datos desde Excel/CSV
- Crea el usuario administrador inicial

---

## Instalación manual

### 1. Clona el repositorio

```sh
git clone https://github.com/Englis666/gestorplus.git
cd gestorplus
```

### 2. Levanta los servicios

- Para desarrollo:
  ```sh
  docker compose --profile dev up
  ```
- Para producción:
  ```sh
  docker compose --profile prod up --build -d
  ```

### 3. Acceso

- Frontend: [http://localhost:3000](http://localhost:3000) (dev)
  o [http://localhost/](http://localhost/) (prod)
- Backend/API: [http://localhost/](http://localhost/)

---

## Scripts de base de datos

- Inicializa la base de datos ejecutando los scripts en `bd/`:
  - `01_baseDeDatosLimpia.sql` (estructura)
  - `gestorplus2.sql` (datos y procedimientos)
  - `procedures/`, `triggers/`, `views/` (modularizados)

Puedes montar la carpeta `bd/` en el contenedor de la base de datos para inicialización automática.

---

## Variables de entorno

(Mejora e implentacion proximamente )
Configura las variables necesarias en el archivo `.env` para el backend y frontend, por ejemplo:

- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, etc.
- `REACT_APP_API_URL` para el frontend (opcional)

---

## Uso de la API

La API utiliza endpoints tipo:

```
POST http://localhost/?action=login
POST http://localhost/?action=agregarPublicacion
```

Consulta la documentación en `/Docs/GRUPO #3/Quinto Trimestre/Documentacion API/` para detalles de cada endpoint.

---

## Documentación

Encuentra documentación técnica, diagramas, casos de uso y presentaciones en la carpeta [`Docs/`](Docs/).

---

## Instalador interactivo

El script [`install-gestorplus.sh`](install-gestorplus.sh) automatiza todo el proceso de instalación y despliegue, incluyendo:

- Verificación de dependencias
- Instalación de herramientas necesarias
- Clonado del repositorio
- Instalación de dependencias del frontend
- Levantamiento de servicios Docker
- Importación opcional de datos desde Excel/CSV
- Creación del usuario administrador

**Para ejecutarlo:**

```bash
bash install-gestorplus.sh
```

---

## Contribución

Quieres dejar una huella en gestorplus y que CodeAdvance te pueda reclutar? has las siguientes instrucciones:

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Haz tus cambios y abre un Pull Request.

---

## Licencia

Este proyecto es propiedad de CodeAdvance, cualquier uso inadecuado o robo de material se sancionara legalmente, este un software que ayude a empresas en recursos humanos sin embargo todo el codigo hecho a la medida es para un solo uso correspondiente y solo los miembros de CodeAdvance podran restribuirlo, si quieres usar algo del codigo fuente consulta a los propietarios de Gestorplus (CodeAdvance) que son:
Englis Alexander Barros Osuna (Anth)
Juan Estevan Becerra Genes (stemansote)
Johan Estiven Vargas
Cristiam Guitierrez Cadena.

Muchas gracias y Consulta la documentación para detalles de uso y distribución.

---

> **AVISO LEGAL:**  
> Este software y todo su código fuente son propiedad exclusiva de CodeAdvance.  
> Queda estrictamente prohibida la copia, redistribución, uso no autorizado o ingeniería inversa del código, total o parcial, sin el consentimiento expreso y por escrito de CodeAdvance.  
> El incumplimiento será sancionado conforme a la ley.

---

**¿Dudas o sugerencias?**  
Consulta la documentación en [`/Docs`](Docs/) o contacta al equipo de desarrollo.
