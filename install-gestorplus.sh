#!/bin/bash
set -e

GREEN="\033[1;32m"; YELLOW="\033[1;33m"; RED="\033[1;31m"
CYAN="\033[1;36m"; BLUE="\033[1;34m"; MAGENTA="\033[1;35m"; RESET="\033[0m"

source lib/banner.sh
source lib/dependencies.sh
source lib/repo.sh
source lib/frontend.sh
source lib/docker.sh
source lib/env.sh
source lib/migrate.sh
source lib/final.sh

show_banner
intro
detect_distro
install_dependencies
check_docker_permissions
clone_or_use_repo

echo "¿Quieres entorno de desarrollo (1) o producción (2)?"
read -rp "Elige (1 o 2): " perfil

if [[ "$perfil" == "1" ]]; then
  install_frontend
  choose_profile_and_run
else
  docker compose -f docker-compose.prod.yml up -d --build
fi

find_php_container
select_and_copy_env
migrate_excel
create_admin_user
final_messages