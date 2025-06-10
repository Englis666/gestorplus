function migrate_excel() {
  echo "🗂️ Paso 8: ¡Hora de traer tus datos a GestorPlus!"

  echo "📊 ¿Tienes datos en Excel o CSV que quieras importar?"
  echo "Este paso es opcional. Si no tienes nada que importar, no pasa nada."
  echo "  1) Sí, quiero importar un archivo."
  echo "  2) No, por ahora no quiero importar nada."
  read -rp "¿Qué decides? (1 o 2): " migrate_choice

  if [[ "$migrate_choice" == "1" ]]; then
    local file_path=""
    if command -v zenity >/dev/null 2>&1; then
      echo "Se abrirá una ventanita para que elijas tu archivo Excel o CSV..."
      file_path=$(zenity --file-selection --title="Selecciona tu archivo Excel o CSV para migrar")
    else
      read -rp "Introduce la ruta COMPLETA del archivo Excel o CSV: " file_path
    fi

    if [ -z "$file_path" ]; then
      echo "⚠️ No seleccionaste ningún archivo. Se omite la migración."
      pause
      return
    fi

    if [ ! -f "$file_path" ]; then
      echo "❌ Archivo no encontrado: ${file_path}"
      pause
      return
    fi

    php_container=$(docker ps --filter "name=gestorplus-php" --format "{{.Names}}")
    if [ -z "$php_container" ]; then
      echo "❌ Contenedor PHP no encontrado. ¿Docker está corriendo?"
      pause
      return
    fi

    echo "📁 Preparando carpeta '/var/www/html/public/uploads' dentro del contenedor..."
    docker exec "$php_container" mkdir -p /var/www/html/public/uploads

    filename=$(basename "$file_path")
    echo "📤 Copiando archivo '${filename}' al contenedor..."
    docker cp "$file_path" "$php_container":/var/www/html/public/uploads/"$filename" || {
      echo "❌ Error al copiar el archivo al contenedor."
      pause
      return
    }

    echo "🚀 Ejecutando migración en el contenedor..."
    docker exec "$php_container" php migrations/MigrarExcelRunner.php "/var/www/html/public/uploads/$filename" || {
      echo "❌ La migración falló. Revisa los datos del archivo."
      pause
      return
    }

    echo "✅ ¡Migración desde Excel/CSV completada exitosamente!"
    pause
  fi
}
function create_admin_user() {
  echo "👑 Paso 9: ¡Creando a tu primer súper administrador de GestorPlus!"
  echo "Este usuario tendrá control total sobre la aplicación. ¡Elige bien sus datos!"
  echo "Se te pedirán los detalles para este nuevo usuario."
  docker exec "$php_container" php migrations/CrearAdministrador.php || {
    echo "¡No pude crear el usuario administrador! Algo salió mal."
    echo "Asegúrate de que el contenedor PHP esté vivo y coleando."
    exit 1
  }
  echo "✅ ¡Usuario administrador creado con éxito! ¡Eres el jefe!"
  pause
}