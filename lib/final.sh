function final_messages() {
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo "█                                                                           █"
  echo "█     🎉🎉🎉  ¡FELICIDADES! ¡GestorPlus está completamente instalado!  🎉🎉🎉   █"
  echo "█                                                                           █"
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo ""

  local ip=$(hostname -I | awk '{print $1}')
  local url="http://localhost:3000" 

  if [[ -n "$ip" && "$ip" != "127.0.0.1" ]]; then
    url="http://$ip:3000"
  fi
  
  echo "Puedes abrir GestorPlus en tu navegador favorito en esta dirección:"
  echo "  $url"
  echo ""
  echo "Para tu primer inicio de sesión, usa estas credenciales por defecto:"
  echo "  Número de documento (num_doc): 898989"
  echo "  Contraseña: 123456789"
  echo ""
  echo "🚨 ¡MUY IMPORTANTE!: Por tu seguridad, cambia esta contraseña genérica justo después"
  echo "de tu primer inicio de sesión. ¡Hazlo para mantener tus datos seguros!"
  echo ""
  echo "¡Disfruta de GestorPlus! Si tienes alguna duda, la documentación es tu mejor amiga."
  echo "¡Gracias por usar este instalador interactivo!"
  pause
}