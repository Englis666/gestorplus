function choose_profile_and_run() {
  echo -e "${YELLOW}⚙️ Paso 6: ¡Es hora de decidir cómo quieres que GestorPlus funcione!${RESET}"
  echo "  ${BLUE}1) Desarrollo${RESET} (Ideal para probar cosas o si eres un desarrollador curioso.)"
  echo "  ${BLUE}2) Producción${RESET} (Si quieres usar GestorPlus para trabajar de verdad, ¡esta es tu opción!)"
  read -rp "$(echo -e "${CYAN}¿Qué perfil prefieres? (1 o 2): ${RESET}")" profile_choice

  local compose_file="docker-compose.dev.yml"
  local compose_profiles=""
  if [[ "$profile_choice" == "2" ]]; then
    compose_file="docker-compose.prod.yml"
    echo "¡Has elegido el perfil de ${GREEN}Producción${GREEN}! ¡Excelente decisión para la acción real!${RESET}"
  else
    echo "¡Has elegido el perfil de ${GREEN}Desarrollo${GREEN}! ¡Perfecto para explorar y experimentar!${RESET}"
    compose_profiles="--profile dev"
  fi

  echo "¡Levantando los servicios de GestorPlus con Docker Compose! Esto puede tardar un momento..."

  if command -v docker compose >/dev/null 2>&1; then
    docker compose -f "$compose_file" $compose_profiles up -d || {
      echo -e "${RED}¡Error al levantar los servicios de Docker! ¿Docker está corriendo?${RESET}"
      echo "Revisa los mensajes de error de Docker Compose para más pistas."
      exit 1
    }
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f "$compose_file" $compose_profiles up -d || {
      echo -e "${RED}¡Error al levantar los servicios de Docker! ¿Docker está corriendo?${RESET}"
      echo "Revisa los mensajes de error de Docker Compose para más pistas."
      exit 1
    }
  else
    echo -e "${RED}No se encontró Docker Compose en tu sistema. Instálalo antes de continuar.${RESET}"
    exit 1
  fi

  echo -e "${GREEN}🚀 ¡Los servicios de GestorPlus están en marcha en segundo plano!${RESET}"
  pause
}