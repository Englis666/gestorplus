function migrate_excel() {
  echo -e "🗂️ Paso 8: ¡Hora de traer tus datos a GestorPlus!"

  echo -e "📊 Paso 8: ¿Tienes datos en Excel o CSV que quieras traer a GestorPlus?"
  echo "Este paso es opcional. Si no tienes nada que importar, ¡no hay problema!"
  echo "  1) Sí, quiero importar un archivo."
  echo "  2) No, por ahora no quiero importar nada."
  read -rp "$(echo -e "${CYAN}¿Qué decides? (1 o 2): ")" migrate_choice

  if [[ "$migrate_choice" == "1" ]]; then
    local file_path=""
    if command -v zenity >/dev/null 2>&1; then
      echo "¡Se abrirá una ventanita mágica para que elijas tu archivo Excel o CSV!"
      file_path=$(zenity --file-selection --title="¡Elige tu archivo Excel o CSV para la migración!")
    else
      read -rp "$(echo -e "${CYAN}Por favor, introduce la RUTA COMPLETA de tu archivo Excel o CSV: ")" file_path
    fi

    if [ -z "$file_path" ]; then
      echo -e "¡Uy! No seleccionaste ningún archivo. Saltando la migración de Excel/CSV."
      pause
      return
    fi

    if [ ! -f "$file_path" ]; then
      echo -e "¡Ese archivo no existe! Revisa la ruta: ${file_path}"
      pause
      return
    fi

    php_container=$(docker ps --filter "name=gestorplus-php" --format "{{.Names}}")
    if [ -z "$php_container" ]; then
      echo -e "❌ No se encontró el contenedor PHP. ¿Está corriendo Docker correctamente?"
      pause
      return
    fi

    docker exec "$php_container" mkdir -p /var/www/html/public/uploads

    echo "¡Copiando tu archivo '${file_path}' al contenedor PHP! Casi listo..."
    docker cp "$file_path" "$php_container":/var/www/html/public/uploads/ || {
      echo -e "¡Problemas al copiar el archivo al contenedor! ¿Está corriendo el contenedor?"
      pause
      return
    }

    # 🚀 Ejecutar migración PHP dentro del contenedor
    basefile=$(basename "$file_path")
    echo "📥 Ejecutando la migración en el contenedor..."
    docker exec "$php_container" php migrations/MigrarExcelRunner.php "/var/www/html/public/uploads/$basefile" || {
      echo -e "❌ Error al ejecutar la migración en el contenedor."
      pause
      return
    }

    echo -e "✅ ¡Migración completada con éxito!"
    pause
  fi
}