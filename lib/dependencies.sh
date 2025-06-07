function check_docker_permissions() {
  echo "Paso 1: Verificando si Docker puede funcionar sin 'sudo'."
  echo "Necesitamos que Docker funcione sin pedirte la clave a cada rato. Es más cómodo así."
  sudo usermod -aG docker $USER

  if docker ps >/dev/null 2>&1; then
    echo "Docker ya tiene sus permisos listos para funcionar sin 'sudo'."
  else
    echo "Parece que Docker necesita un pequeño ajuste para trabajar sin 'sudo'."
    echo "La solución es sencilla. Solo copia y pega este comando en tu terminal:"
    echo "    sudo usermod -aG docker \$USER"
    echo "Después de ejecutarlo, es importante que cierres tu sesión y vuelvas a iniciarla"
    echo "para que los cambios se activen."
    echo "Si algo no va bien, revisa la documentación oficial de Docker."
    echo "Por ahora, no podemos avanzar sin esos permisos. Vuelve cuando estén listos."
    exit 1 
  fi
  pause
}

function detect_distro() {
  echo "Paso 2: Detectando tu distribución de Linux."
  echo "Esto nos ayuda a saber qué herramientas usar para instalar todo lo que necesitamos."

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
      echo "Tu distribución no es común. Tendrás que instalar a mano: docker, docker-compose, git, npm y figlet."
      read -rp "¿Quieres intentar continuar con la instalación manual? (s/n): " choice_manual
      if [[ "$choice_manual" != "s" && "$choice_manual" != "S" ]]; then
        echo "Instalación cancelada. Vuelve cuando quieras retomar."
        exit 1
      fi
      PKG_MANAGER="manual" 
    fi
  else
    echo "No pude detectar tu distribución de Linux."
    echo "Por favor, instala manualmente las herramientas necesarias (docker, docker-compose, git, npm, figlet)."
    PKG_MANAGER="manual"
  fi
  pause
}

function install_dependencies() {
  echo "Paso 3: Instalando las herramientas que GestorPlus necesita para funcionar."
  echo "Esto puede tardar un poco, depende de la velocidad de tu internet."

  case "$PKG_MANAGER" in
    apt)
      echo "Ejecutando: sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet"
      sudo apt update && sudo apt install -y docker.io docker-compose git npm figlet || {
        echo "Hubo un problema instalando las dependencias con apt."
        echo "Asegúrate de que tus repositorios estén bien configurados."
        exit 1
      }
      if ! sudo ufw status | grep -q "Status: active"; then
        echo "Activando el firewall UFW..."
        sudo ufw enable
      fi
      ;;
    pacman)
      echo "Ejecutando: sudo pacman -Syu --noconfirm docker docker-compose git npm figlet"
      sudo pacman -Syu --noconfirm docker docker-compose git npm figlet ufw || {
        echo "Hubo un problema instalando las dependencias con pacman."
        echo "Revisa tu conexión o los repositorios de Arch."
        exit 1
      }
      if ! sudo ufw status | grep -q "Status: active"; then
        echo "Activando el firewall UFW..."
        sudo ufw enable
      fi
      ;;
    yay|paru)
      echo "Ejecutando: $PKG_MANAGER -Syu --noconfirm docker docker-compose git npm figlet"
      $PKG_MANAGER -Syu --noconfirm docker docker-compose git npm figlet || {
        echo "Hubo un problema instalando las dependencias con $PKG_MANAGER."
        echo "Intenta instalar los paquetes manualmente o revisa los mirrors."
        exit 1
      }
      ;;
    manual)
      echo "ATENCIÓN: Debes instalar docker, docker-compose, git, npm y figlet por tu cuenta."
      echo "Por favor, asegúrate de tenerlas listas antes de seguir."
      ;;
    *)
      echo "Tu sistema no es compatible con la instalación automática. Revisa la documentación."
      exit 1
      ;;
  esac

  echo "Herramientas instaladas o verificadas."

  for cmd in docker docker-compose git npm figlet; do
    if ! command -v $cmd >/dev/null 2>&1; then
      echo "La herramienta '${cmd}' no se encontró tras la instalación. Verifica manualmente."
    fi
  done

  pause
}