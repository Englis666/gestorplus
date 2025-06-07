
GREEN="\033[1;32m"; YELLOW="\033[1;33m"; RED="\033[1;31m"
CYAN="\033[1;36m"; BLUE="\033[1;34m"; MAGENTA="\033[1;35m"; RESET="\033[0m"
function migrate_excel() {
  echo -e "${YELLOW}🗂️ Paso 8: ¡Hora de traer tus datos a GestorPlus!${RESET}"

  echo -e "${YELLOW}📊 Paso 8: ¿Tienes datos en Excel o CSV que quieras traer a GestorPlus?${RESET}"
  echo "Este paso es opcional. Si no tienes nada que importar, ¡no hay problema!"
  echo "  ${BLUE}1) Sí, quiero importar un archivo.${RESET}"
  echo "  ${BLUE}2) No, por ahora no quiero importar nada.${RESET}"
  read -rp "$(echo -e "${CYAN}¿Qué decides? (1 o 2): ${RESET}")" migrate_choice

  if [[ "$migrate_choice" == "1" ]]; then
    local file_path=""
    if command -v zenity >/dev/null 2>&1; then
      echo "¡Se abrirá una ventanita mágica para que elijas tu archivo Excel o CSV!"
      file_path=$(zenity --file-selection --title="¡Elige tu archivo Excel o CSV para la migración!")
    else
      read -rp "$(echo -e "${CYAN}Por favor, introduce la RUTA COMPLETA de tu archivo Excel o CSV: ${RESET}")" file_path
    fi

    if [ -z "$file_path" ]; then
      echo -e "${YELLOW}¡Uy! No seleccionaste ningún archivo. Saltando la migración de Excel/CSV.${RESET}"
      pause
      return
    fi

    if [ ! -f "$file_path" ]; then
      echo -e "${RED}¡Ese archivo no existe! Revisa la ruta: ${file_path}${RESET}"
      pause
      return
    fi

    php_container=$(docker ps --filter "name=gestorplus-php" --format "{{.Names}}")
    if [ -z "$php_container" ]; then
      echo -e "${RED}❌ No se encontró el contenedor PHP. ¿Está corriendo Docker correctamente?${RESET}"
      pause
      return
    fi

    docker exec "$php_container" mkdir -p /var/www/html/public/uploads

    echo "¡Copiando tu archivo '${file_path}' al contenedor PHP! Casi listo..."
    docker cp "$file_path" "$php_container":/var/www/html/public/uploads/ || {
      echo -e "${RED}¡Problemas al copiar el archivo al contenedor! ¿Está corriendo el contenedor?${RESET}"
      pause
      return
    }
  fi
}

function create_admin_user() {
  php_container=$(docker ps --filter "name=gestorplus-php" --format "{{.Names}}")
  if [ -z "$php_container" ]; then
    echo -e "${RED}❌ No se encontró el contenedor PHP. ¿Está corriendo Docker correctamente?${RESET}"
    pause
    return
  fi
  echo -e "${YELLOW}👑 Paso 9: ¡Creando a tu primer súper administrador de GestorPlus!${RESET}"
  echo "Este usuario tendrá control total sobre la aplicación. ¡Elige bien sus datos!"
  echo "Se te pedirán los detalles para este nuevo usuario."
  docker exec "$php_container" php migrations/CrearAdministrador.php || {
    echo -e "${RED}¡No pude crear el usuario administrador! Algo salió mal.${RESET}"
    echo "Asegúrate de que el contenedor PHP esté vivo y coleando."
    exit 1
  }
  echo -e "${GREEN}✅ ¡Usuario administrador creado con éxito! ¡Eres el jefe!${RESET}"
  pause
}