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

  # Si tienes un banner de CodeAdvance, agrégalo aquí
  local codeadvance_banner=()

  local total_banner_lines=$(( ${#gestorplus_banner[@]} + ${#created_by_banner[@]} + ${#codeadvance_banner[@]} + ${#dev_team_info[@]} + 6 )) # +6 por los espacios entre banners
  local start_line=$(( (lines - total_banner_lines) / 2 ))

  # Imprimir espacios en blanco para centrado vertical
  for (( i=0; i<start_line; i++ )); do echo; done

  # Imprimir banner de GestorPlus
  for line in "${gestorplus_banner[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo "" # Espacio

  # Imprimir banner "Software Creado Por:"
  for line in "${created_by_banner[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo ""

  # Imprimir banner de CodeAdvance (si existe)
  for line in "${codeadvance_banner[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo "" # Espacio

  # Imprimir banner de developers
  for line in "${developers_banner[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo "" 

  # Imprimir información del equipo de desarrollo
  for line in "${dev_team_info[@]}"; do
    local padding=$(( (columns - ${#line}) / 2 ))
    printf "%*s%s\n" "$padding" "" "$line"
  done
  echo "" # Espacio final
}

function pause() {
  echo "" 
  read -rp "¡Listo! Presiona Enter para continuar con el siguiente paso..."
  echo "" 
}


function intro() {
  echo "¡Hola! Soy tu asistente personal para instalar GestorPlus."
  echo "Este script hará todo el trabajo pesado por ti, automatizando la instalación"
  echo "y guiándote paso a paso. No te preocupes, en cada fase te explicaré qué está pasando."
  echo "¡Prepárate para una instalación sin complicaciones!"
  pause
}