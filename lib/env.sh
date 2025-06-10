function prompt_env_values() {
  local confirm="n"
  while [[ "$confirm" != "s" && "$confirm" != "S" ]]; do
    echo -e "Vamos a crear un nuevo archivo .env. Por favor, ingresa los siguientes valores:"
    read -rp "MYSQL_ROOT_PASSWORD: " MYSQL_ROOT_PASSWORD
    read -rp "DB_HOST: " DB_HOST
    read -rp "DB_NAME: " DB_NAME
    read -rp "DB_PORT: " DB_PORT
    read -rp "DB_USER: " DB_USER
    read -rp "DB_PASS: " DB_PASS
    read -rp "DB_SSL (true/false): " DB_SSL
    read -rp "MAIL_HOST: " MAIL_HOST
    read -rp "MAIL_PORT: " MAIL_PORT
    read -rp "MAIL_USERNAME: " MAIL_USERNAME
    read -rp "MAIL_PASSWORD: " MAIL_PASSWORD
    read -rp "MAIL_FROM: " MAIL_FROM
    read -rp "MAIL_FROM_NAME: " MAIL_FROM_NAME

    echo ""
    echo "Resumen de los valores ingresados:"
    echo "MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD"
    echo "DB_HOST=$DB_HOST"
    echo "DB_NAME=$DB_NAME"
    echo "DB_PORT=$DB_PORT"
    echo "DB_USER=$DB_USER"
    echo "DB_PASS=$DB_PASS"
    echo "DB_SSL=$DB_SSL"
    echo "MAIL_HOST=$MAIL_HOST"
    echo "MAIL_PORT=$MAIL_PORT"
    echo "MAIL_USERNAME=$MAIL_USERNAME"
    echo "MAIL_PASSWORD=$MAIL_PASSWORD"
    echo "MAIL_FROM=$MAIL_FROM"
    echo "MAIL_FROM_NAME=$MAIL_FROM_NAME"
    echo ""
    read -rp "¿Son correctos estos valores? (s/n): " confirm
    if [[ "$confirm" != "s" && "$confirm" != "S" ]]; then
      echo "Vamos a volver a ingresar los valores."
    fi
  done

  env_path="./.env"
  cat > "$env_path" <<EOF
# Archivo .env para docker-compose

MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD

DB_HOST=$DB_HOST
DB_NAME=$DB_NAME
DB_PORT=$DB_PORT
DB_USER=$DB_USER
DB_PASS=$DB_PASS
DB_SSL=$DB_SSL

MAIL_HOST=$MAIL_HOST
MAIL_PORT=$MAIL_PORT
MAIL_USERNAME=$MAIL_USERNAME
MAIL_PASSWORD=$MAIL_PASSWORD
MAIL_FROM=$MAIL_FROM
MAIL_FROM_NAME=$MAIL_FROM_NAME
EOF
  echo -e "Archivo .env creado en $env_path"
}

function select_and_copy_env() {
  prompt_env_values

  if [ ! -f "./.env" ]; then
    echo -e "¡No se pudo crear el archivo .env! Cancela esta parte del proceso."
    pause
    return 1
  fi

  docker cp "./.env" "$php_container":/var/www/html/.env
  echo -e "✅ Archivo .env copiado correctamente al contenedor PHP."

  reload_dockers

  return 0
}

function reload_dockers(){
  echo "¿En qué entorno quieres reiniciar el contenedor PHP?"
  echo "  1) Desarrollo"
  echo "  2) Producción"
  read -rp "Elige una opción (1 o 2): " env_choice

  if [[ "$env_choice" == "2" ]]; then
    local compose_file="docker-compose.prod.yml"
  else
    local compose_file="docker-compose.dev.yml"
  fi

  local project_root="$(dirname "$(dirname "$0")")"
  cd "$project_root" || {
    echo -e "No se pudo acceder al directorio del proyecto: $project_root"
    return 1
  }

  echo "Vamos a reiniciar el contenedor PHP para aplicar los cambios."
  if command -v docker compose >/dev/null 2>&1; then
    docker compose -f "$compose_file" restart gestorplus-php
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f "$compose_file" restart gestorplus-php
  else
    docker restart gestorplus-php
  fi
  echo -e "Contenedor PHP reiniciado correctamente."
}