function clone_or_use_repo() {
  echo -e "${YELLOW}📦 Paso 4: Verificando el código fuente de GestorPlus en tu equipo...${RESET}"

  if [ -d "frontend" ] && [ -d "backend" ]; then
    echo -e "${GREEN}✔️  El código fuente ya está presente en la carpeta actual. No es necesario clonar nada.${RESET}"
    pause
    return
  fi

  echo -e "${RED}❌ No se encontraron las carpetas necesarias (frontend/backend) en la carpeta actual.${RESET}"
  echo -e "${RED}Por favor, descarga el código fuente manualmente o usa el instalador completo.${RESET}"
  exit 1
}