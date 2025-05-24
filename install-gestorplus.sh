#!/bin/bash

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
  echo "Este script automatiza la instalación y explica cada paso."
  pause
}

# Comprobar permisos Docker
function check_docker_permissions() {
  echo -e "${YELLOW}Paso 1: Verificando permisos para usar Docker...${RESET}"
  if docker ps >/dev/null 2>&1; then
    echo -e "${GREEN}Docker está funcionando correctamente sin sudo.${RESET}"
  else
    echo -e "${RED}No tienes permisos para ejecutar Docker sin sudo."
    echo "Ejecuta: sudo usermod -aG docker \$USER"
    echo "Luego cierra sesión y vuelve a entrar."
    exit 1
  fi
  pause
}

# Detectar distro
function detect_distro() {
  echo -e "${YELLOW}Paso 2: Detectando tu distribución Linux...${RESET}"
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "Distribución detectada: $NAME"
    if [[ "$ID" == "ubuntu" || "$ID_LIKE" == *"debian"* ]]; then
      PKG_MANAGER="apt"
    elif [[ "$ID" == "arch" || "$ID_LIKE" == *"arch"* ]]; then
      PKG_MANAGER="pacman"
    else
      echo -e "${RED}Distribución no soportada automáticamente.${RESET}"
      echo "Instala manualmente: docker, docker-compose, git, npm, figlet"
      pause
      return
    fi
  fi
  pause
}

# Instalar dependencias
function install_dependencies() {
  echo -e "${YELLOW}Paso 3: Instalando dependencias necesarias...${RESET}"
  case "$PKG_MANAGER" in
    apt)
      sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet
      ;;
    pacman)
      sudo pacman -Syu --noconfirm docker docker-compose git npm figlet
      ;;
    *)
      echo -e "${RED}Instalación automática no disponible.${RESET}"
      ;;
  esac
  pause
}

# Clonar repositorio
function clone_or_use_repo() {
  echo -e "${YELLOW}Paso 4: Clonar o usar el repositorio GestorPlus...${RESET}"
  if [ -d "gestorplus" ]; then
    echo "La carpeta 'gestorplus' ya existe."
    echo "1) Usar carpeta existente"
    echo "2) Eliminar y clonar de nuevo"
    echo "3) Salir"
    read -rp "Elige una opción (1-3): " choice
    case $choice in
      1) echo "Usando carpeta existente." ;;
      2)
        rm -rf gestorplus
        git clone https://github.com/Englis666/gestorplus.git
        ;;
      3) exit 0 ;;
      *) echo "Opción inválida."; exit 1 ;;
    esac
  else
    git clone https://github.com/Englis666/gestorplus.git
  fi
  pause
}

# Instalar frontend
function install_frontend() {
  echo -e "${YELLOW}Paso 5: Instalando dependencias del frontend...${RESET}"
  cd gestorplus/frontend || { echo -e "${RED}No se encontró la carpeta frontend.${RESET}"; exit 1; }
  npm install
  cd ../..
  pause
}

# Elegir perfil y levantar servicios
function choose_profile_and_run() {
  echo -e "${YELLOW}Paso 6: Elige el perfil de despliegue:${RESET}"
  echo "1) Desarrollo"
  echo "2) Producción"
  read -rp "Elige (1 o 2): " profile_choice
  profile="dev"
  [[ "$profile_choice" == "2" ]] && profile="prod"
  cd gestorplus || exit 1
  docker compose --profile "$profile" up -d
  cd ..
  pause
}

# Encontrar contenedor PHP
function find_php_container() {
  echo -e "${YELLOW}Paso 7: Buscando contenedor PHP...${RESET}"
  php_container=$(docker ps --format "{{.Names}}" | grep php)
  if [ -z "$php_container" ]; then
    echo -e "${RED}No se encontró contenedor PHP activo.${RESET}"
    exit 1
  else
    echo "Contenedor PHP: $php_container"
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
      file_path=$(zenity --file-selection --title="Selecciona archivo Excel o CSV")
    else
      read -rp "Introduce la ruta del archivo: " file_path
    fi
    if [ ! -f "$file_path" ]; then
      echo -e "${RED}Archivo no encontrado: $file_path${RESET}"
      pause
      return
    fi
    docker cp "$file_path" "$php_container":/var/www/html/public/uploads/
    basefile=$(basename "$file_path")
    docker exec "$php_container" php migrations/MigrarExcelRunner.php "/app/tmp_migrar.xlsx"
  fi
  pause
}

# Crear usuario admin
function create_admin_user() {
  echo -e "${YELLOW}Paso 9: Crear usuario administrador...${RESET}"
  docker exec "$php_container" php migrations/CrearAdministrador.php
  pause
}

# Final
function final_messages() {
  echo -e "${GREEN}¡Instalación completa!${RESET}"

  # Detectar IP local o pública
  if hostname -I | grep -q "127.0.0.1"; then
    url="http://localhost:3000"
  else
    ip=$(hostname -I | awk '{print $1}')
    url="http://$ip:3000"
  fi

  echo "Accede a: $url"
  echo "Credenciales por defecto:"
  echo "  num_doc: 898989"
  echo "  Contraseña: 123456789"
  echo -e "${CYAN}¡Cambia la contraseña después del primer inicio de sesión!${RESET}"
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
