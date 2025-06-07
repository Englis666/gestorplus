

function check_docker_permissions() {
  echo -e "🚀 Paso 1: ¡Verificando si Docker puede volar sin 'sudo'!"
  echo "Necesitamos que Docker funcione sin pedirte la clave a cada rato. ¡Es más cómodo así!"
  sudo usermod -aG docker $USER

  if docker ps >/dev/null 2>&1; then
    echo -e "🥳 ¡Genial! Docker ya tiene sus permisos listos para despegar sin 'sudo'."
  else
    echo -e "Uh oh... Parece que Docker necesita un pequeño empujón para trabajar sin 'sudo'."
    echo "¡No te preocupes! La solución es sencilla. Solo copia y pega este comando en tu terminal:"
    echo -e "    sudo usermod -aG docker \$USER"
    echo -e "Después de ejecutarlo, es súper importante que ${MAGENTA}cierres tu sesión y vuelvas a iniciarla"
    echo "para que los cambios se activen. ¡Así Docker será tu mejor amigo!"
    echo "Si algo no va bien, la documentación oficial de Docker siempre ayuda."
    echo -e "Por ahora, no podemos avanzar sin esos permisos. ¡Vuelve cuando estén listos!"
    exit 1 
  fi
  pause
}

function detect_distro() {
  echo -e "🕵️‍♀️ Paso 2: ¡Descubriendo qué sabor de Linux tienes!"
  echo "Esto nos ayuda a saber qué herramientas usar para instalar todo lo que necesitamos."

  if [ -f /etc/os-release ]; then
    . /etc/os-release 
    echo "¡Tu sistema es $NAME! ¡Qué buena elección!"
    if [[ "$ID" == "ubuntu" || "$ID_LIKE" == *"debian"* ]]; then
      PKG_MANAGER="apt"
      echo "Usaremos ${BLUE}apt, el mago de los paquetes en sistemas basados en Debian/Ubuntu."
    elif [[ "$ID" == "arch" || "$ID_LIKE" == *"arch"* ]]; then
      PKG_MANAGER="pacman"
      echo "Usaremos ${BLUE}pacman, el ninja de los paquetes en Arch Linux."
    else
      echo -e "¡Vaya! Tu distribución no es tan común para mí, ¡es una joya!"
      echo "No te preocupes, aún podemos instalar GestorPlus, pero necesitaré tu ayuda."
      echo "Tendrás que instalar a mano: docker, docker-compose, git, npm y figlet."
      read -rp "¿Quieres intentar continuar con la instalación manual? (s/n): " choice_manual
      if [[ "$choice_manual" != "s" && "$choice_manual" != "S" ]]; then
        echo -e "¡Entendido! Instalación cancelada. ¡Vuelve cuando quieras retomar!"
        exit 1
      fi
      PKG_MANAGER="manual" 
    fi
  else
    echo -e "¡Ups! No pude descifrar tu distribución de Linux."
    echo "Por favor, instala manualmente las herramientas necesarias (docker, docker-compose, git, npm, figlet)."
    PKG_MANAGER="manual"
  fi
  pause
}

function install_dependencies() {
  echo -e "🛠️ Paso 3: ¡Instalando las herramientas que GestorPlus necesita para funcionar!"
  echo "Esto puede tardar un poco, ¡depende de la velocidad de tu internet!"

  case "$PKG_MANAGER" in
    apt)
      echo -e "Ejecutando: sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet"
      sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet || {
        echo -e "❌ ¡Rayos! Hubo un problema instalando las dependencias con apt."
        echo "🔧 Asegúrate de que tus repositorios estén bien configurados."
        exit 1
      }
      ;;
    pacman)
      echo -e "Ejecutando: sudo pacman -Syu --noconfirm docker docker-compose git npm figlet"
      sudo pacman -Syu --noconfirm docker docker-compose git npm figlet || {
        echo -e "❌ ¡Rayos! Hubo un problema instalando las dependencias con pacman."
        echo "🔧 Revisa tu conexión o los repositorios de Arch."
        exit 1
      }
      ;;
    yay|paru)
      echo -e "Ejecutando: $PKG_MANAGER -Syu --noconfirm docker docker-compose git npm figlet"
      $PKG_MANAGER -Syu --noconfirm docker docker-compose git npm figlet || {
        echo -e "❌ ¡Rayos! Hubo un problema instalando las dependencias con $PKG_MANAGER."
        echo "🔧 Intenta instalar los paquetes manualmente o revisa los mirrors."
        exit 1
      }
      ;;
    manual)
      echo -e "🚨 ¡ATENCIÓN! Recuerda que debes instalar docker, docker-compose, git, npm y figlet por tu cuenta."
      echo "Por favor, asegúrate de tenerlas listas antes de seguir."
      ;;
    *)
      echo -e "❌ ¡Lo siento! Tu sistema no es compatible con la instalación automática. ¡Revisa la documentación!"
      exit 1
      ;;
  esac

  echo -e "✅ ¡Herramientas instaladas o verificadas! ¡Vamos por buen camino!"


  for cmd in docker docker-compose git npm figlet; do
    if ! command -v $cmd >/dev/null 2>&1; then
      echo -e "⚠️ La herramienta '${cmd}' no se encontró tras la instalación. Verifica manualmente."
    fi
  done

  pause
}
