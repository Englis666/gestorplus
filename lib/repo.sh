function clone_or_use_repo() {
  echo -e "${YELLOW}📦 Paso 4: ¡Trayendo el código de GestorPlus a tu equipo!${RESET}"
  local repo_dir="gestorplus"
  local repo_url="https://github.com/Englis666/gestorplus.git"

  if [ -d "$repo_dir" ]; then
    echo "¡Mira! Ya hay una carpeta llamada '${repo_dir}' aquí."
    echo "¿Qué quieres hacer con ella?"
    echo "  ${BLUE}1) Usar la carpeta existente${RESET} (si ya tienes el código)."
    echo "  ${BLUE}2) Borrarla y descargar el código de nuevo${RESET} (para una instalación impecable)."
    echo "  ${BLUE}3) Salir del instalador${RESET} (si quieres gestionar la carpeta a tu manera)."
    read -rp "$(echo -e "${CYAN}Elige tu aventura (1-3): ${RESET}")" choice
    case $choice in
      1)
        echo "¡De acuerdo! Usaremos la carpeta '${repo_dir}'. Asegúrate de que tenga la última versión."
        ;;
      2)
        echo "¡Entendido! Borrando la carpeta anterior y clonando el repositorio fresquito..."
        rm -rf "$repo_dir" || {
          echo -e "${RED}¡No pude borrar la carpeta '${repo_dir}'! ¿Tienes permisos?${RESET}"
          exit 1
        }
        git clone "$repo_url" || {
          echo -e "${RED}¡Error al clonar el repositorio! ¿Tienes conexión a internet?${RESET}"
          exit 1
        }
        ;;
      3)
        echo -e "${RED}¡Oops! Instalación cancelada. ¡Cuando quieras, aquí estaré!${RESET}"
        exit 0
        ;;
      *)
        echo -e "${RED}¡Esa opción no la conozco! Saliendo del instalador por seguridad.${RESET}"
        exit 1
        ;;
    esac
  else
    echo "¡Descargando el corazón de GestorPlus desde GitHub! Esto tomará un momento..."
    git clone "$repo_url" || {
      echo -e "${RED}¡No pude descargar el repositorio! Verifica tu conexión a internet.${RESET}"
      exit 1
    }
  fi
  echo -e "${GREEN}🎉 ¡El código de GestorPlus está listo en tu máquina!${RESET}"
  pause
}