function install_frontend() {
  echo "💻 Paso 5: ¡Preparando la parte visual de GestorPlus (el frontend)!"

  echo "¿Para qué entorno quieres trabajar?"
  echo "  1) Desarrollo (npm run start, hot reload, debugging)"
  echo "  2) Producción (Docker, build automático, sin npm local)"
  read -rp "Elige una opción (1 o 2): " build_choice

  if [[ "$build_choice" == "1" ]]; then
    if [ -d "frontend" ]; then
      cd frontend || {
        echo "¡No pude entrar a la carpeta 'frontend'! ¿El código está completo?"
        exit 1
      }
      echo "Ejecutando npm install para desarrollo..."
      npm install || {
        echo "¡Problemas al instalar las dependencias del frontend!"
        exit 1
      }
    else
      echo "¡No encuentro la carpeta 'frontend'! ¿Se descargó todo bien?"
      exit 1
    fi
  elif [[ "$build_choice" == "2" ]]; then
    echo "No es necesario compilar manualmente. El build se hará dentro del contenedor Docker."
    echo "Ejecutando Docker Compose para producción..."
    docker compose -f docker-compose.prod.yml up -d --build
    echo "¡Listo! El frontend se construyó y está corriendo en el contenedor."
  else
    echo "Opción inválida. Cancela la preparación del frontend."
    exit 1
  fi
  pause
}