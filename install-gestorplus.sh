
# Este script automatiza la instalación y configuración de GestorPlus,
# una aplicación que utiliza Docker, Docker Compose, Git, Node.js y PHP.
# ¡Hecho para que sea súper fácil y amigable!

# --- Colores para una experiencia más vibrante en tu terminal ---
GREEN="\033[1;32m"   
YELLOW="\033[1;33m"  
RED="\033[1;31m"     
CYAN="\033[1;36m"     
BLUE="\033[1;34m"     
MAGENTA="\033[1;35m"  
RESET="\033[0m"      

# --- Funciones de Utilidad (tus asistentes personales) ---

# Función para pausar, esperando que presiones Enter
function pause() {
  echo "" 
  read -rp "$(echo -e "${CYAN}¡Listo! Presiona ${MAGENTA}Enter${CYAN} para continuar con el siguiente paso...${RESET}")"
  echo "" 
}

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

# --- Pasos de Instalación (la aventura comienza) ---

# 1. Introducción mágica al instalador
function intro() {
  echo -e "${CYAN}¡Hola! Soy tu asistente personal para instalar GestorPlus.${RESET}"
  echo "Este script hará todo el trabajo pesado por ti, automatizando la instalación"
  echo "y guiándote paso a paso. No te preocupes, en cada fase te explicaré qué está pasando."
  echo -e "${BLUE}¡Prepárate para una instalación sin complicaciones!${RESET}"
  pause
}

# 2. Comprobando los súper poderes de Docker (permisos)
function check_docker_permissions() {
  echo -e "${YELLOW}🚀 Paso 1: ¡Verificando si Docker puede volar sin 'sudo'!${RESET}"
  echo "Necesitamos que Docker funcione sin pedirte la clave a cada rato. ¡Es más cómodo así!"

  if docker ps >/dev/null 2>&1; then
    echo -e "${GREEN}🥳 ¡Genial! Docker ya tiene sus permisos listos para despegar sin 'sudo'.${RESET}"
  else
    echo -e "${RED}Uh oh... Parece que Docker necesita un pequeño empujón para trabajar sin 'sudo'.${RESET}"
    echo "¡No te preocupes! La solución es sencilla. Solo copia y pega este comando en tu terminal:"
    echo -e "${CYAN}    sudo usermod -aG docker \$USER${RESET}"
    echo -e "Después de ejecutarlo, es súper importante que ${MAGENTA}cierres tu sesión y vuelvas a iniciarla${RESET}"
    echo "para que los cambios se activen. ¡Así Docker será tu mejor amigo!"
    echo "Si algo no va bien, la documentación oficial de Docker siempre ayuda."
    echo -e "${RED}Por ahora, no podemos avanzar sin esos permisos. ¡Vuelve cuando estén listos!${RESET}"
    exit 1 
  fi
  pause
}

function detect_distro() {
  echo -e "${YELLOW}🕵️‍♀️ Paso 2: ¡Descubriendo qué sabor de Linux tienes!${RESET}"
  echo "Esto nos ayuda a saber qué herramientas usar para instalar todo lo que necesitamos."

  if [ -f /etc/os-release ]; then
    . /etc/os-release # ¡Leemos su "acta de nacimiento"!
    echo "¡Tu sistema es ${GREEN}$NAME${RESET}! ¡Qué buena elección!"
    if [[ "$ID" == "ubuntu" || "$ID_LIKE" == *"debian"* ]]; then
      PKG_MANAGER="apt"
      echo "Usaremos ${BLUE}apt${RESET}, el mago de los paquetes en sistemas basados en Debian/Ubuntu."
    elif [[ "$ID" == "arch" || "$ID_LIKE" == *"arch"* ]]; then
      PKG_MANAGER="pacman"
      echo "Usaremos ${BLUE}pacman${RESET}, el ninja de los paquetes en Arch Linux."
    else
      echo -e "${RED}¡Vaya! Tu distribución no es tan común para mí, ¡es una joya!${RESET}"
      echo "No te preocupes, aún podemos instalar GestorPlus, pero necesitaré tu ayuda."
      echo "Tendrás que instalar a mano: ${CYAN}docker, docker-compose, git, npm${RESET} y ${CYAN}figlet${RESET}."
      read -rp "¿Quieres intentar continuar con la instalación manual? (s/n): " choice_manual
      if [[ "$choice_manual" != "s" && "$choice_manual" != "S" ]]; then
        echo -e "${RED}¡Entendido! Instalación cancelada. ¡Vuelve cuando quieras retomar!${RESET}"
        exit 1
      fi
      PKG_MANAGER="manual" 
    fi
  else
    echo -e "${RED}¡Ups! No pude descifrar tu distribución de Linux.${RESET}"
    echo "Por favor, instala manualmente las herramientas necesarias (docker, docker-compose, git, npm, figlet)."
    PKG_MANAGER="manual"
  fi
  pause
}

function install_dependencies() {
  echo -e "${YELLOW}🛠️ Paso 3: ¡Instalando las herramientas que GestorPlus necesita para funcionar!${RESET}"
  echo "Esto puede tardar un poco, ¡depende de la velocidad de tu internet!"

  case "$PKG_MANAGER" in
    apt)
      echo -e "Ejecutando: ${CYAN}sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet${RESET}"
      sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet || {
        echo -e "${RED}❌ ¡Rayos! Hubo un problema instalando las dependencias con apt.${RESET}"
        echo "🔧 Asegúrate de que tus repositorios estén bien configurados."
        exit 1
      }
      ;;
    pacman)
      echo -e "Ejecutando: ${CYAN}sudo pacman -Syu --noconfirm docker docker-compose git npm figlet${RESET}"
      sudo pacman -Syu --noconfirm docker docker-compose git npm figlet || {
        echo -e "${RED}❌ ¡Rayos! Hubo un problema instalando las dependencias con pacman.${RESET}"
        echo "🔧 Revisa tu conexión o los repositorios de Arch."
        exit 1
      }
      ;;
    yay|paru)
      echo -e "Ejecutando: ${CYAN}$PKG_MANAGER -Syu --noconfirm docker docker-compose git npm figlet${RESET}"
      $PKG_MANAGER -Syu --noconfirm docker docker-compose git npm figlet || {
        echo -e "${RED}❌ ¡Rayos! Hubo un problema instalando las dependencias con $PKG_MANAGER.${RESET}"
        echo "🔧 Intenta instalar los paquetes manualmente o revisa los mirrors."
        exit 1
      }
      ;;
    manual)
      echo -e "${YELLOW}🚨 ¡ATENCIÓN! Recuerda que debes instalar ${CYAN}docker, docker-compose, git, npm${RESET} y ${CYAN}figlet${RESET} por tu cuenta."
      echo "Por favor, asegúrate de tenerlas listas antes de seguir."
      ;;
    *)
      echo -e "${RED}❌ ¡Lo siento! Tu sistema no es compatible con la instalación automática. ¡Revisa la documentación!${RESET}"
      exit 1
      ;;
  esac

  echo -e "${GREEN}✅ ¡Herramientas instaladas o verificadas! ¡Vamos por buen camino!${RESET}"


  for cmd in docker docker-compose git npm figlet; do
    if ! command -v $cmd >/dev/null 2>&1; then
      echo -e "${RED}⚠️ La herramienta '${cmd}' no se encontró tras la instalación. Verifica manualmente.${RESET}"
    fi
  done

  pause
}


# 5. GestorPlus clonando el repositorio
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

# 6. El cerebro de la interfaz (instalando el frontend)
function install_frontend() {
  echo -e "${YELLOW}💻 Paso 5: ¡Preparando la parte visual de GestorPlus (el frontend)!${RESET}"
  echo "Esto es como armar un rompecabezas, ¡con muchas piezas (paquetes de Node.js)!"
  if [ -d "gestorplus/frontend" ]; then
    cd gestorplus/frontend || {
      echo -e "${RED}¡No pude entrar a la carpeta 'frontend'! ¿El código está completo?${RESET}"
      exit 1
    }
    echo -e "Ejecutando ${CYAN}npm install${RESET} para que todo encaje..."
    npm install || {
      echo -e "${RED}¡Problemas al instalar las dependencias del frontend! ¿npm está bien?${RESET}"
      exit 1
    }
    cd ../.. # ¡Volvemos a casa!
    echo -e "${GREEN}✨ ¡El frontend de GestorPlus está listo para brillar!${RESET}"
  else
    echo -e "${RED}¡No encuentro la carpeta 'frontend' dentro de 'gestorplus'! ¿Se descargó todo bien?${RESET}"
    exit 1
  fi
  pause
}

# 7. Despertando los motores (levantar servicios Docker Compose)
function choose_profile_and_run() {
  echo -e "${YELLOW}⚙️ Paso 6: ¡Es hora de decidir cómo quieres que GestorPlus funcione!${RESET}"
  echo "  ${BLUE}1) Desarrollo${RESET} (Ideal para probar cosas o si eres un desarrollador curioso.)"
  echo "  ${BLUE}2) Producción${RESET} (Si quieres usar GestorPlus para trabajar de verdad, ¡esta es tu opción!)"
  read -rp "$(echo -e "${CYAN}¿Qué perfil prefieres? (1 o 2): ${RESET}")" profile_choice

  profile="dev" # El valor por defecto, por si acaso
  if [[ "$profile_choice" == "2" ]]; then
    profile="prod"
    echo "¡Has elegido el perfil de ${GREEN}Producción${GREEN}! ¡Excelente decisión para la acción real!${RESET}"
  else
    echo "¡Has elegido el perfil de ${GREEN}Desarrollo${GREEN}! ¡Perfecto para explorar y experimentar!${RESET}"
  fi

  echo "¡Levantando los servicios de GestorPlus con Docker Compose! Esto puede tardar un momento..."
  cd gestorplus || {
    echo -e "${RED}¡No pude entrar a la carpeta 'gestorplus'! Algo no salió bien antes.${RESET}"
    exit 1
  }
  docker compose --profile "$profile" up -d || {
    echo -e "${RED}¡Error al levantar los servicios de Docker! ¿Docker está corriendo?${RESET}"
    echo "Revisa los mensajes de error de Docker Compose para más pistas."
    exit 1
  }
  cd .. # ¡Regreso al directorio original!
  echo -e "${GREEN}🚀 ¡Los servicios de GestorPlus están en marcha en segundo plano!${RESET}"
  pause
}

# 8. Buscando a nuestro amigo PHP (encontrando el contenedor)
function find_php_container() {
  echo -e "${YELLOW}🔍 Paso 7: ¡Buscando al cerebro de GestorPlus, el contenedor PHP!${RESET}"
  echo "Necesitamos encontrarlo para poder hablar con él y hacer algunas configuraciones."
  php_container=$(docker ps --filter "name=gestorplus" --format "{{.Names}}" | grep php)

  if [ -z "$php_container" ]; then
    echo -e "${RED}¡Ay! No encuentro el contenedor PHP activo de GestorPlus.${RESET}"
    echo "Asegúrate de que el paso anterior (`docker compose up`) haya funcionado sin problemas."
    exit 1
  else
    echo "¡Lo encontré! Tu contenedor PHP se llama: ${GREEN}$php_container${RESET}"
  fi
  pause
}

# 9. La gran migración (importar datos Excel/CSV)
function migrate_excel() {
  echo -e "${YELLOW}📊 Paso 8: ¿Tienes datos en Excel o CSV que quieras traer a GestorPlus?${RESET}"
  echo "Este paso es opcional. Si no tienes nada que importar, ¡no hay problema!"
  echo "  ${BLUE}1) Sí, quiero importar un archivo.${RESET}"
  echo "  ${BLUE}2) No, por ahora no quiero importar nada.${RESET}"
  read -rp "$(echo -e "${CYAN}¿Qué decides? (1 o 2): ${RESET}")" migrate_choice

  if [[ "$migrate_choice" == "1" ]]; then
    local file_path=""
    # Si tienes Zenity, ¡usamos una ventana gráfica para que sea más fácil!
    if command -v zenity >/dev/null 2>&1; then
      echo "¡Se abrirá una ventanita mágica para que elijas tu archivo Excel o CSV!"
      file_path=$(zenity --file-selection --title="¡Elige tu archivo Excel o CSV para la migración!")
    else
      read -rp "$(echo -e "${CYAN}Por favor, introduce la RUTA COMPLETA de tu archivo Excel o CSV: ${RESET}")" file_path
    fi

    if [ -z "$file_path" ]; then
      echo -e "${YELLOW}¡Uy! No seleccionaste ningún archivo. Saltando la migración de Excel/CSV.${RESET}"
      pause
      return
    fi

    if [ ! -f "$file_path" ]; then
      echo -e "${RED}¡Ese archivo no existe! Revisa la ruta: ${file_path}${RESET}"
      pause
      return
    fi

    echo "¡Copiando tu archivo '${file_path}' al contenedor PHP! Casi listo..."
    docker cp "$file_path" "$php_container":/var/www/html/public/uploads/ || {
      echo -e "${RED}¡Problemas al copiar el archivo al contenedor! ¿Está corriendo el contenedor?${RESET}"
      pause
      return
    }

    local basefile=$(basename "$file_path") # Solo el nombre del archivo, sin la ruta
    echo "¡Ejecutando la migración dentro del contenedor PHP! ¡Un poco de magia de datos!"
    docker exec "$php_container" php migrations/MigrarExcelRunner.php "/var/www/html/public/uploads/$basefile" || {
      echo -e "${RED}¡La migración falló dentro del contenedor! Revisa los logs de Docker.${RESET}"
      pause
      return
    }
    echo -e "${GREEN}🎉 ¡Migración de Excel/CSV completada con éxito! ¡Tus datos están a salvo!${RESET}"
  else
    echo "¡Entendido! No haremos ninguna migración por ahora. Puedes hacerlo más tarde si lo necesitas."
  fi
  pause
}

# 10. Creando el usuario administrador
function create_admin_user() {
  echo -e "${YELLOW}👑 Paso 9: ¡Creando a tu primer súper administrador de GestorPlus!${RESET}"
  echo "Este usuario tendrá control total sobre la aplicación. ¡Elige bien sus datos!"
  echo "Se te pedirán los detalles para este nuevo usuario."
  docker exec "$php_container" php migrations/CrearAdministrador.php || {
    echo -e "${RED}¡No pude crear el usuario administrador! Algo salió mal.${RESET}"
    echo "Asegúrate de que el contenedor PHP esté vivo y coleando."
    exit 1
  }
  echo -e "${GREEN}✅ ¡Usuario administrador creado con éxito! ¡Eres el jefe!${RESET}"
  pause
}

# 11. ¡La gran revelación! (mensajes finales y cómo acceder)
function final_messages() {
  echo -e "${GREEN}█████████████████████████████████████████████████████████████████████████████${RESET}"
  echo -e "${GREEN}█                                                                           █${RESET}"
  echo -e "${GREEN}█     🎉🎉🎉  ¡FELICIDADES! ¡GestorPlus está completamente instalado!  🎉🎉🎉   █${RESET}"
  echo -e "${GREEN}█                                                                           █${RESET}"
  echo -e "${GREEN}█████████████████████████████████████████████████████████████████████████████${RESET}"
  echo ""

  local ip=$(hostname -I | awk '{print $1}')
  local url="http://localhost:3000" 

  if [[ -n "$ip" && "$ip" != "127.0.0.1" ]]; then
    url="http://$ip:3000"
  fi

  echo -e "Puedes abrir GestorPlus en tu navegador favorito en esta dirección:"
  echo -e "${CYAN}  ${url}${RESET}"
  echo ""
  echo -e "Para tu primer inicio de sesión, usa estas credenciales por defecto:"
  echo -e "  ${BLUE}Número de documento (num_doc):${RESET} ${MAGENTA}898989${RESET}"
  echo -e "  ${BLUE}Contraseña:${RESET} ${MAGENTA}123456789${RESET}"
  echo ""
  echo -e "${CYAN}🚨 ¡MUY IMPORTANTE!: Por tu seguridad, cambia esta contraseña genérica justo después${RESET}"
  echo -e "${CYAN}de tu primer inicio de sesión. ¡Hazlo para mantener tus datos seguros!${RESET}"
  echo ""
  echo -e "¡Disfruta de GestorPlus! Si tienes alguna duda, la documentación es tu mejor amiga."
  echo -e "${MAGENTA}¡Gracias por usar este instalador interactivo!${RESET}"
  pause
}

# --- ¡La Gran Orquesta de Funciones! (ejecución principal) ---

show_banner             
intro                   
check_docker_permissions 
detect_distro           
install_dependencies    
clone_or_use_repo       
install_frontend       
choose_profile_and_run  
find_php_container      
migrate_excel           
create_admin_user       
final_messages          