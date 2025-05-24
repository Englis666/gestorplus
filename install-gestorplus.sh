# Colores para textos
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
CYAN="\033[1;36m"
RESET="\033[0m"

# Función para pausar
function pause() {
  read -rp "$(echo -e "${CYAN}Presiona Enter para continuar...${RESET}")"
}

# Mostrar banner
function show_banner() {
  echo -e "${GREEN}"
  echo "  ____ _____ ____ _____ ___  ____  ____  _    _   _ ____"
  echo " / ___| ____/ ___|_   _/ _ \\|  _ \\|  _ \\| |  | | | / ___|"
  echo "| |  _|  _| \\___ \\ | || | | | |_) | |_) | |  | | | \\___ \\"
  echo "| |_| | |___ ___) || || |_| |  _ <|  __/| |__| |_| |___) |"
  echo " \\____|_____|____/ |_| \\___/|_| \\_\\_|   |_____\\___/|____/"
  echo -e "${RESET}"
}

# Introducción
function intro() {
  echo -e "${CYAN}Bienvenido al instalador y asistente interactivo de GestorPlus.${RESET}"
  echo "Este script automatiza la instalación y te guiará paso a paso."
  echo "En cada paso, recibirás instrucciones claras para que puedas entender qué está pasando."
  pause
}

# Comprobar permisos Docker
function check_docker_permissions() {
  echo -e "${YELLOW}Paso 1: Verificando permisos para usar Docker sin sudo...${RESET}"
  if docker ps >/dev/null 2>&1; then
    echo -e "${GREEN}¡Perfecto! Docker funciona sin necesidad de sudo.${RESET}"
  else
    echo -e "${RED}Oops, parece que no tienes permisos para ejecutar Docker sin sudo.${RESET}"
    echo "Para solucionarlo, ejecuta este comando:"
    echo -e "${CYAN}sudo usermod -aG docker \$USER${RESET}"
    echo "Luego cierra sesión y vuelve a iniciar sesión para aplicar los cambios."
    echo "Si necesitas ayuda, consulta la documentación oficial de Docker."
    echo -e "${RED}El instalador no puede continuar sin permisos adecuados.${RESET}"
    exit 1
  fi
  pause
}

# Detectar distro
function detect_distro() {
  echo -e "${YELLOW}Paso 2: Detectando tu distribución Linux...${RESET}"
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "Distribución detectada: ${GREEN}$NAME${RESET}"
    if [[ "$ID" == "ubuntu" || "$ID_LIKE" == *"debian"* ]]; then
      PKG_MANAGER="apt"
      echo "Usaremos apt para instalar paquetes."
    elif [[ "$ID" == "arch" || "$ID_LIKE" == *"arch"* ]]; then
      PKG_MANAGER="pacman"
      echo "Usaremos pacman para instalar paquetes."
    else
      echo -e "${RED}Distribución no soportada automáticamente.${RESET}"
      echo "Deberás instalar manualmente docker, docker-compose, git, npm y figlet."
      echo "¿Quieres continuar con la instalación manual? (s/n)"
      read -r choice_manual
      if [[ "$choice_manual" != "s" && "$choice_manual" != "S" ]]; then
        echo "Instalación abortada."
        exit 1
      fi
      PKG_MANAGER="manual"
    fi
  else
    echo -e "${RED}No se pudo detectar la distribución Linux.${RESET}"
    echo "Debes instalar manualmente las dependencias necesarias."
    PKG_MANAGER="manual"
  fi
  pause
}

# Instalar dependencias
function install_dependencies() {
  echo -e "${YELLOW}Paso 3: Instalando dependencias necesarias...${RESET}"
  case "$PKG_MANAGER" in
    apt)
      echo "Ejecutando: sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet"
      sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet
      ;;
    pacman)
      echo "Ejecutando: sudo pacman -Syu --noconfirm docker docker-compose git npm figlet"
      sudo pacman -Syu --noconfirm docker docker-compose git npm figlet
      ;;
    manual)
      echo -e "${YELLOW}Recuerda instalar manualmente: docker, docker-compose, git, npm, figlet.${RESET}"
      ;;
    *)
      echo -e "${RED}GestorPlus no soporta la instalación automática para tu sistema.${RESET}"
      ;;
  esac
  echo -e "${GREEN}Dependencias instaladas o verificadas.${RESET}"
  pause
}

# Clonar repositorio
function clone_or_use_repo() {
  echo -e "${YELLOW}Paso 4: Clonar o usar el repositorio GestorPlus...${RESET}"
  if [ -d "gestorplus" ]; then
    echo "La carpeta 'gestorplus' ya existe."
    echo "¿Qué quieres hacer?"
    echo "1) Usar la carpeta existente"
    echo "2) Eliminar y clonar de nuevo"
    echo "3) Salir del instalador"
    read -rp "Elige una opción (1-3): " choice
    case $choice in
      1) echo "Usando carpeta existente 'gestorplus'." ;;
      2)
        echo "Eliminando carpeta existente y clonando repositorio de nuevo..."
        rm -rf gestorplus
        git clone https://github.com/Englis666/gestorplus.git || {
          echo -e "${RED}Error al clonar el repositorio.${RESET}"
          exit 1
        }
        ;;
      3)
        echo "Instalación cancelada por usuario."
        exit 0
        ;;
      *)
        echo -e "${RED}Opción inválida.${RESET}"
        exit 1
        ;;
    esac
  else
    echo "Clonando el repositorio GestorPlus..."
    git clone https://github.com/Englis666/gestorplus.git || {
      echo -e "${RED}Error al clonar el repositorio.${RESET}"
      exit 1
    }
  fi
  echo -e "${GREEN}Repositorio listo.${RESET}"
  pause
}

# Instalar frontend
function install_frontend() {
  echo -e "${YELLOW}Paso 5: Instalando dependencias del frontend...${RESET}"
  if [ -d "gestorplus/frontend" ]; then
    cd gestorplus/frontend || {
      echo -e "${RED}No se pudo acceder a la carpeta frontend.${RESET}"
      exit 1
    }
    echo "Ejecutando npm install para instalar dependencias del frontend..."
    npm install || {
      echo -e "${RED}Error instalando dependencias del frontend.${RESET}"
      exit 1
    }
    cd ../..
    echo -e "${GREEN}Dependencias del frontend instaladas correctamente.${RESET}"
  else
    echo -e "${RED}No se encontró la carpeta 'frontend' dentro de 'gestorplus'.${RESET}"
    exit 1
  fi
  pause
}

# Elegir perfil y levantar servicios
function choose_profile_and_run() {
  echo -e "${YELLOW}Paso 6: Elige el perfil de despliegue:${RESET}"
  echo "1) Desarrollo"
  echo "2) Producción"
  read -rp "Elige (1 o 2): " profile_choice
  profile="dev"
  if [[ "$profile_choice" == "2" ]]; then
    profile="prod"
  fi
  echo "Levantar servicios con perfil '${profile}' usando Docker Compose..."
  cd gestorplus || {
    echo -e "${RED}No se pudo acceder a la carpeta gestorplus.${RESET}"
    exit 1
  }
  docker compose --profile "$profile" up -d || {
    echo -e "${RED}Error al levantar servicios Docker.${RESET}"
    exit 1
  }
  cd ..
  echo -e "${GREEN}Servicios levantados correctamente.${RESET}"
  pause
}

# Encontrar contenedor PHP
function find_php_container() {
  echo -e "${YELLOW}Paso 7: Buscando contenedor PHP activo...${RESET}"
  php_container=$(docker ps --format "{{.Names}}" | grep php)
  if [ -z "$php_container" ]; then
    echo -e "${RED}No se encontró ningún contenedor PHP activo.${RESET}"
    echo "Asegúrate de que Docker Compose haya levantado los servicios correctamente."
    exit 1
  else
    echo "Contenedor PHP encontrado: ${GREEN}$php_container${RESET}"
  fi
  pause
}

# Migrar Excel/CSV
function migrate_excel() {
  echo -e "${YELLOW}Paso 8: ¿Deseas migrar un archivo Excel o CSV?${RESET}"
  echo "1) Sí"
  echo "2) No"
  read -rp "Opción: " migrate_choice
  if [[ "$migrate_choice" == "1" ]]; then
    if command -v zenity >/dev/null 2>&1; then
      echo "Selecciona el archivo Excel o CSV para migrar (ventana gráfica)..."
      file_path=$(zenity --file-selection --title="Selecciona archivo Excel o CSV")
    else
      read -rp "Introduce la ruta completa del archivo Excel o CSV: " file_path
    fi
    if [ ! -f "$file_path" ]; then
      echo -e "${RED}Archivo no encontrado: $file_path${RESET}"
      pause
      return
    fi
    echo "Copiando archivo al contenedor PHP..."
    docker cp "$file_path" "$php_container":/var/www/html/public/uploads/ || {
      echo -e "${RED}Error copiando archivo al contenedor.${RESET}"
      pause
      return
    }
    basefile=$(basename "$file_path")
    echo "Ejecutando migración dentro del contenedor PHP..."
    docker exec "$php_container" php migrations/MigrarExcelRunner.php "/app/tmp_migrar.xlsx" || {
      echo -e "${RED}Error ejecutando migración.${RESET}"
      pause
      return
    }
    echo -e "${GREEN}Migración completada.${RESET}"
  else
    echo "No se migró ningún archivo."
  fi
  pause
}

# Crear usuario admin
function create_admin_user() {
  echo -e "${YELLOW}Paso 9: Crear usuario administrador...${RESET}"
  echo "Este usuario tendrá permisos completos para gestionar la aplicación."
  docker exec "$php_container" php migrations/CrearAdministrador.php || {
    echo -e "${RED}Error creando usuario administrador.${RESET}"
    exit 1
  }
  echo -e "${GREEN}Usuario administrador creado correctamente.${RESET}"
  pause
}

# Final
function final_messages() {
  echo -e "${GREEN}¡Instalación completa!${RESET}"
  echo ""

  # Detectar IP local o pública para acceso frontend
  ip=$(hostname -I | awk '{print $1}')
  if [[ "$ip" == "127.0.0.1" || -z "$ip" ]]; then
    url="http://localhost:3000"
  else
    url="http://$ip:3000"
  fi

  echo "Puedes acceder a la aplicación en:"
  echo -e "${CYAN}$url${RESET}"
  echo ""
  echo "Credenciales por defecto para iniciar sesión:"
  echo "  Número de documento (num_doc): 898989"
  echo "  Contraseña: 123456789"
  echo -e "${CYAN}Por seguridad, cambia la contraseña después del primer inicio de sesión.${RESET}"
  pause
}

# ----------- EJECUCIÓN PRINCIPAL -----------

show_banner
intro
check_docker_permissions
detect_distro
install_dependencies
clone_or_use_repo
install_frontend
choose_profile_and_run
find_php_container
migrate_excel
create_admin_user
final_messages
