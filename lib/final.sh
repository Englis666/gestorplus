
GREEN="\033[1;32m"; YELLOW="\033[1;33m"; RED="\033[1;31m"
CYAN="\033[1;36m"; BLUE="\033[1;34m"; MAGENTA="\033[1;35m"; RESET="\033[0m"
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