function choose_profile_and_run() {
  echo "⚙️ Paso 6: ¡Es hora de decidir cómo quieres que GestorPlus funcione!"
  echo "  1) Desarrollo (Ideal para probar cosas o si eres un desarrollador curioso.)"
  echo "  2) Producción (Si quieres usar GestorPlus para trabajar de verdad, ¡esta es tu opción!)"
  read -rp "¿Qué perfil prefieres? (1 o 2): " profile_choice

  local compose_file="docker-compose.dev.yml"
  local compose_profiles=""
  if [[ "$profile_choice" == "2" ]]; then
    compose_file="docker-compose.prod.yml"
    echo "¡Has elegido el perfil de Producción! ¡Excelente decisión para la acción real!"
  else
    echo "¡Has elegido el perfil de Desarrollo! ¡Perfecto para explorar y experimentar!"
    compose_profiles="--profile dev"
  fi

  echo "¡Levantando los servicios de GestorPlus con Docker Compose! Esto puede tardar un momento..."

  if command -v docker compose >/dev/null 2>&1; then
    docker compose -f "$compose_file" $compose_profiles up -d || {
      echo "¡Error al levantar los servicios de Docker! ¿Docker está corriendo?"
      echo "Revisa los mensajes de error de Docker Compose para más pistas."
      exit 1
    }
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f "$compose_file" $compose_profiles up -d || {
      echo "¡Error al levantar los servicios de Docker! ¿Docker está corriendo?"
      echo "Revisa los mensajes de error de Docker Compose para más pistas."
      exit 1
    }
  else
    echo "No se encontró Docker Compose en tu sistema. Instálalo antes de continuar."
    exit 1
  fi

  echo "🚀 ¡Los servicios de GestorPlus están en marcha en segundo plano!"
  pause
}

function find_php_container() {
  echo "🔍 Paso 7: ¡Buscando al cerebro de GestorPlus, el contenedor PHP!"
  echo "Necesitamos encontrarlo para poder hablar con él y hacer algunas configuraciones."
  php_container=$(docker ps --filter "name=gestorplus" --format "{{.Names}}" | grep php)

  if [ -z "$php_container" ]; then
    echo "¡Ay! No encuentro el contenedor PHP activo de GestorPlus."
    echo "Asegúrate de que el paso anterior (\`docker compose up\`) haya funcionado sin problemas."
    exit 1
  else
    echo "¡Lo encontré! Tu contenedor PHP se llama: $php_container"
  fi
  pause
}