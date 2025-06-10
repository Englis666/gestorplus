function migrate_excel() {
  echo "${YELLOW}🗂️ Paso 8: ¡Hora de traer tus datos a GestorPlus!${RESET}"

  echo -e "${YELLOW}📊 ¿Tienes datos en Excel o CSV que quieras importar?${RESET}"
  echo "Este paso es opcional. Si no tienes nada que importar, no pasa nada."
  echo "  ${BLUE}1) Sí, quiero importar un archivo.${RESET}"
  echo "  ${BLUE}2) No, por ahora no quiero importar nada.${RESET}"
  read -rp "$(echo -e "${CYAN}¿Qué decides? (1 o 2): ${RESET}")" migrate_choice

  if [[ "$migrate_choice" == "1" ]]; then
    local file_path=""
    if command -v zenity >/dev/null 2>&1; then
      echo "🪟 Se abrirá una ventanita para que elijas tu archivo Excel o CSV..."
      file_path=$(zenity --file-selection --title="Selecciona tu archivo Excel o CSV para migrar")
    else
      read -rp "$(echo -e "${CYAN}Introduce la ruta COMPLETA del archivo Excel o CSV: ${RESET}")" file_path
    fi

    if [ -z "$file_path" ]; then
      echo -e "${YELLOW}⚠️ No seleccionaste ningún archivo. Se omite la migración.${RESET}"
      pause
      return
    fi

    if [ ! -f "$file_path" ]; then
      echo -e "${RED}❌ Archivo no encontrado: ${file_path}${RESET}"
      pause
      return
    fi

    php_container=$(docker ps --filter "name=gestorplus-php" --format "{{.Names}}")
    if [ -z "$php_container" ]; then
      echo -e "${RED}❌ Contenedor PHP no encontrado. ¿Docker está corriendo?${RESET}"
      pause
      return
    fi

    echo "📁 Preparando carpeta '/var/www/html/public/uploads' dentro del contenedor..."
    docker exec "$php_container" mkdir -p /var/www/html/public/uploads

    file_name=$(basename "$file_path")
    echo "📤 Copiando archivo '${file_name}' al contenedor..."
    docker cp "$file_path" "$php_container":/var/www/html/public/uploads/"$file_name" || {
      echo -e "${RED}❌ Error al copiar el archivo al contenedor.${RESET}"
      pause
      return
    }

    echo "🚀 Ejecutando migración en el contenedor..."
    docker exec "$php_container" php gestorplus/backend/migrations/MigrarExcelRunner.php "/var/www/html/public/uploads/$file_name" || {
      echo -e "${RED}❌ La migración falló. Revisa los datos del archivo.${RESET}"
      pause
      return
    }

    echo -e "${GREEN}✅ ¡Migración desde Excel/CSV completada exitosamente!${RESET}"
    pause
  fi
}
function create_admin_user() {
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

