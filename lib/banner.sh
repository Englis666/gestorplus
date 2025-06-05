

# Función para limpiar la pantalla y mostrar nuestros increíbles banners
function show_banner() {
  clear 

  local columns=$(tput cols) 
  local lines=$(tput lines)   

  # Nuestro banner de GestorPlus
  local gestorplus_banner=(
"  ____ _____ ____ _____ ___  ____  ____  _    _   _ ____"
" / ___| ____/ ___|_   _/ _ \\|  _ \\|  _ \\| |  | | | / ___|"
"| |  _|  _| \\___ \\ | || | | | |_) | |_) | |  | | | \\___ \\"
"| |_1 | |___ ___) || || |_1 |  _ <|  __/| |__| |_| |___) |"
" \\____|_____|____/ |_| \\___/|_| \\_\\_|   \\_____\\___/|____/"
  )

  # Banner "Software Creado Por:"
  local created_by_banner=(
"  ____       _             _       _"
" / ___|___   __| | ___   / \\   __| |_   ____ _ _ __   ___ ___"
"| |   / _ \\ / _\` |/ _ \\ / _ \\ / _\` \\ \\ / / _\` | '_ \\ / __/ _ \\"
"| |__| (_) | (_| |  __// ___ \\ (_| |\\ V / (_| | | | | (_|  __/"
" \\____\\___/ \\__,_|\\___/_/   \\_\\__,_| \\_/ \\__,_|_| |_|\\___\\___|"
  )

  developers_banner=(
  "  ____                            _ _           _                    "
  " |  _ \  ___  ___  __ _ _ __ ___ | | | __ _  __| | ___  _ __ ___  ___"
  " | | | |/ _ \/ __|/ _\` | '__/ _ \| | |/ _\` |/ _\` |/ _ \| '__/ _ \/ __|"
  " | |_| |  __/\__ \ (_| | | | (_) | | | (_| | (_| | (_) | | |  __/\__ \\"
  " |____/ \___||___/\__,_|_|  \___/|_|_|\__,_|\__,_|\___/|_|  \___||___/"
  )

  local dev_team_info=(

  "  EQUIPO DE DESARROLLO 👾"
  "  ✦ Englis (Acnth)"
  "  ✦ Juan Becerra (stemansote)"
  "  ✦ Cristian Cadena"
  "  ✦ Johan Rodriguez"
  "  ─────────────────────────────────────────────────────────"
  )


  local total_banner_lines=$(( ${#gestorplus_banner[@]} + ${#created_by_banner[@]} + ${#codeadvance_banner[@]} + ${#dev_team_info[@]} + 6 )) # +6 por los espacios entre banners
  local start_line=$(( (lines - total_banner_lines) / 2 ))

  # Imprimir espacios en blanco para centrado vertical
  for (( i=0; i<start_line; i++ )); do echo; done

  # Imprimir banner de GestorPlus
  echo -e "${GREEN}"
  for line in "${gestorplus_banner[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo -e "${RESET}"
  echo "" # Espacio

  # Imprimir banner "Software Creado Por:"
  echo -e "${BLUE}"
  for line in "${created_by_banner[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo -e "${RESET}"
  echo ""

  # Imprimir banner de CodeAdvance
  echo -e "${MAGENTA}"
  for line in "${codeadvance_banner[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo -e "${RESET}"
  echo "" # Espacio

   # Imprimir banner de CodeAdvance
  echo -e "${MAGENTA}"
  for line in "${developers_banner[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
      printf "%*s%s\n" "$padding" "" "$line"
  done
  echo -e "${RESET}"
  echo "" 

  # Imprimir información del equipo de desarrollo
  echo -e "${CYAN}"
  for line in "${dev_team_info[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo -e "${RESET}"
  echo "" # Espacio final
}

function pause() {
  echo "" 
  read -rp "$(echo -e "${CYAN}¡Listo! Presiona ${MAGENTA}Enter${CYAN} para continuar con el siguiente paso...${RESET}")"
  echo "" 
}


# --- Pasos de Instalación (la aventura comienza) ---

# 1. Introducción mágica al instalador
function intro() {
  echo -e "${CYAN}¡Hola! Soy tu asistente personal para instalar GestorPlus.${RESET}"
  echo "Este script hará todo el trabajo pesado por ti, automatizando la instalación"
  echo "y guiándote paso a paso. No te preocupes, en cada fase te explicaré qué está pasando."
  echo -e "${BLUE}¡Prepárate para una instalación sin complicaciones!${RESET}"
  pause
}