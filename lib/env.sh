function select_and_copy_env() {
  echo -e "${YELLOW}🌱 Selecciona el archivo .env que usará GestorPlus en el contenedor PHP.${RESET}"
  local env_path=""
  if command -v zenity >/dev/null 2>&1; then
    env_path=$(zenity --file-selection --title="Selecciona tu archivo .env para GestorPlus")
  else
    read -rp "$(echo -e "${CYAN}Por favor, introduce la RUTA COMPLETA de tu archivo .env: ${RESET}")" env_path
  fi

  if [ -z "$env_path" ] || [ ! -f "$env_path" ]; then
    echo -e "${RED}¡No se seleccionó un archivo .env válido! Cancela esta parte del proceso.${RESET}"
    pause
    return 1
  fi

  docker cp "$env_path" "$php_container":/var/www/html/backend/.env
  echo -e "${GREEN}✅ Archivo .env copiado correctamente al contenedor PHP.${RESET}"
  return 0
}