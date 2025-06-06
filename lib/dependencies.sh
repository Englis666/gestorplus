function check_docker_permissions() {
  echo -e "${YELLOW}🚀 Paso 1: ¡Verificando si Docker puede volar sin 'sudo'!${RESET}"
  echo "Necesitamos que Docker funcione sin pedirte la clave a cada rato. ¡Es más cómodo así!"
  sudo usermod -aG docker $USER

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
    . /etc/os-release 
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
