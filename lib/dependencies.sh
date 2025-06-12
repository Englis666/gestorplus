function detect_distro() {
  echo "Detectando tu distribución de Linux..."

  if [ -f /etc/os-release ]; then
    . /etc/os-release 
    echo "Tu sistema es $NAME."
    if [[ "$ID" == "ubuntu" || "$ID_LIKE" == *"debian"* ]]; then
      PKG_MANAGER="apt"
      echo "Usaremos apt para instalar los paquetes."
    elif [[ "$ID" == "arch" || "$ID_LIKE" == *"arch"* ]]; then
      PKG_MANAGER="pacman"
      echo "Usaremos pacman para instalar los paquetes."
    else
      echo "Tu distribución no es común. Instala docker y docker-compose manualmente."
      PKG_MANAGER="manual" 
    fi
  else
    echo "No pude detectar tu distribución de Linux."
    echo "Por favor, instala docker y docker-compose manualmente."
    PKG_MANAGER="manual"
  fi
}

function install_dependencies() {
  echo "Instalando Docker y Docker Compose..."

  case "$PKG_MANAGER" in
    apt)
      echo "Ejecutando: sudo apt update && sudo apt install -y docker.io docker-compose"
      sudo apt update && sudo apt install -y docker.io docker-compose || {
        echo "Hubo un problema instalando las dependencias con apt."
        exit 1
      }
      ;;
    pacman)
      echo "Ejecutando: sudo pacman -Syu --noconfirm docker docker-compose"
      sudo pacman -Syu --noconfirm docker docker-compose || {
        echo "Hubo un problema instalando las dependencias con pacman."
        exit 1
      }
      ;;
    manual)
      echo "ATENCIÓN: Debes instalar docker y docker-compose por tu cuenta."
      ;;
    *)
      echo "Tu sistema no es compatible con la instalación automática."
      exit 1
      ;;
  esac

  echo "Herramientas instaladas o verificadas."
}