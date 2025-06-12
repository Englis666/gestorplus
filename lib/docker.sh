 function check_docker_permissions(){
  echo "Verificando Permisos de Docker en tu computador o servidor actual..."
  if ! docker info >/dev/null 2>&1; then
    echo "❌ No tienes permisos para ejecutar Docker. Por favor, agrega tu usuario al grupo 'docker' o ejecuta como root."
    echo "Ejecuta: sudo usermod -aG docker \$USER"
    exit 1
  else
    echo "✔️ Permisos de Docker verificados correctamente."
  fi
 }

function choose_profile_and_run() {
  echo "⚙️ Paso 6: ¿Cómo quieres ejecutar GestorPlus?"
  echo "  1) Desarrollo (docker-compose.dev.yml)"
  echo "  2) Producción (docker-compose.prod.yml)"
  read -rp "¿Qué perfil prefieres? (1 o 2): " profile_choice

  local compose_file="docker-compose.dev.yml"
  if [[ "$profile_choice" == "2" ]]; then
    compose_file="docker-compose.prod.yml"
    echo "¡Perfil de Producción seleccionado!"
  else
    echo "¡Perfil de Desarrollo seleccionado!"
  fi

  echo "Levantando servicios con Docker Compose..."
  docker compose -f "$compose_file" up -d || {
    echo "¡Error al levantar los servicios de Docker! ¿Docker está corriendo?"
    exit 1
  }

  echo "🚀 ¡GestorPlus está en marcha!"
}

function find_php_container() {
  php_container=$(docker ps --filter "name=gestorplus" --format "{{.Names}}" | grep php)
  if [ -z "$php_container" ]; then
    echo "No encuentro el contenedor PHP activo."
    exit 1
  else
    echo "Contenedor PHP: $php_container"
  fi
}