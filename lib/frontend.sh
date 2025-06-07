function install_frontend() {
  echo "💻 Paso 5: ¡Preparando la parte visual de GestorPlus (el frontend)!"
  echo "Esto es como armar un rompecabezas, ¡con muchas piezas (paquetes de Node.js)!"
  if [ -d "frontend" ]; then
    cd frontend || {
      echo "¡No pude entrar a la carpeta 'frontend'! ¿El código está completo?"
      exit 1
    }
    echo "Ejecutando npm install para que todo encaje..."
    npm install || {
      echo "¡Problemas al instalar las dependencias del frontend! ¿npm está bien?"
      exit 1
    }

    echo "¿Para qué entorno quieres compilar el frontend?"
    echo "  1) Desarrollo (más rápido, con mapas de fuente y debugging)"
    echo "  2) Producción (optimizado, minificado, listo para usuarios finales)"
    read -rp "Elige una opción (1 o 2): " build_choice

    if [[ "$build_choice" == "1" ]]; then
      echo "No se ejecuta 'npm run start' porque el frontend se levanta con Docker."
      cd ..
      echo "✨ ¡Listo! El frontend se levantará con Docker en el siguiente paso."
    elif [[ "$build_choice" == "2" ]]; then
      build_cmd="npm run build"
      echo "Ejecutando $build_cmd para compilar el frontend..."
      $build_cmd || {
        echo "¡Problemas al compilar el frontend!"
        exit 1
      }
      mkdir -p ../backend/public
      cp -r build/* ../backend/public/ || {
        echo "¡No pude copiar los archivos compilados al backend! ¿Todo bien con las rutas?"
        exit 1
      }
      cd ..
      echo "✨ ¡El frontend de GestorPlus está listo para producción!"
    else
      echo "Opción inválida. Cancela la compilación del frontend."
      cd ..
      exit 1
    fi
  else
    echo "¡No encuentro la carpeta 'frontend'! ¿Se descargó todo bien?"
    exit 1
  fi
  pause
}