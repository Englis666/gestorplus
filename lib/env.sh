function prompt_env_values() {
  echo -e "${CYAN}Vamos a crear un nuevo archivo .env. Por favor, ingresa los siguientes valores:${RESET}"
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
  echo -e "${GREEN}Archivo .env creado en $env_path${RESET}"
}

function select_env_file() {
  mapfile -t env_files < <(find . -maxdepth 1 -type f -name ".env*" | sort)
  local options=("${env_files[@]}" "Escribir ruta manualmente" "Crear un nuevo .env")
  echo "Opciones:"
  select file in "${options[@]}"; do
    if [[ "$REPLY" -ge 1 && "$REPLY" -le "${#env_files[@]}" ]]; then
      env_path="${file}"
      break
    elif [[ "$REPLY" -eq $((${#env_files[@]}+1)) ]]; then
      read -rp "$(echo -e "${CYAN}Por favor, introduce la RUTA COMPLETA de tu archivo .env: ${RESET}")" env_path
      break
    elif [[ "$REPLY" -eq $((${#env_files[@]}+2)) ]]; then
      prompt_env_values
      break
    else
      echo "Opción inválida."
    fi
  done
  # Si no hay archivos .env y no seleccionó crear uno, pedir ruta manual
  if [ -z "$env_path" ] && [ "${#env_files[@]}" -eq 0 ]; then
    read -rp "$(echo -e "${CYAN}Por favor, introduce la RUTA COMPLETA de tu archivo .env: ${RESET}")" env_path
  fi
}

function select_and_copy_env() {
  echo -e "${YELLOW}🌱 Selecciona el archivo .env que usará GestorPlus en el contenedor PHP.${RESET}"
  local env_path=""

  if command -v zenity >/dev/null 2>&1 && [ -n "$DISPLAY" ]; then
    env_path=$(zenity --file-selection --title="Selecciona tu archivo .env para GestorPlus")
  else
    select_env_file
  fi

  if [ -z "$env_path" ] || [ ! -f "$env_path" ]; then
    echo -e "${RED}¡No se seleccionó un archivo .env válido! Cancela esta parte del proceso.${RESET}"
    pause
    return 1
  fi

  docker cp "$env_path" "$php_container":/var/www/html/.env
  echo -e "${GREEN}✅ Archivo .env copiado correctamente al contenedor PHP.${RESET}"
  return 0
}