function final_messages() {
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo "█                                                                           █"
  echo "█     🎉🎉🎉  ¡FELICIDADES! ¡GestorPlus está completamente instalado!  🎉🎉🎉   █"
  echo "█                                                                           █"
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo ""

  echo ""
  local ip=$(hostname -I | awk '{print $1}')
  local url="http://$ip"
  echo "Puedes abrir GestorPlus en tu navegador favorito en esta dirección:"
  echo "  $url"
  echo ""
  echo "Para tu primer inicio de sesión, usa estas credenciales por defecto:"
  echo "  Número de documento (num_doc): 898989"
  echo "  Contraseña: 123456789"
  echo ""
  echo "¡MUY IMPORTANTE!: Cambia esta contraseña genérica después de tu primer inicio de sesión."
  echo ""
  echo "¡Disfruta de GestorPlus! Si tienes dudas, revisa la documentación."
  echo ""

  read -rp "¿Quieres exponer GestorPlus a Internet usando Cloudflare Tunnel (solo recomendado en producción)? (s/n): " usar_tunnel
  if [[ "$usar_tunnel" =~ ^[sS]$ ]]; then
    if ! command -v cloudflared >/dev/null 2>&1; then
      echo "cloudflared no está instalado. Instálalo antes de continuar."
      echo "En Ubuntu/Debian: sudo apt install cloudflared"
      echo "En Arch: sudo pacman -S cloudflared"
    else
      echo "Iniciando Cloudflare Tunnel en segundo plano..."
      nohup cloudflared tunnel --url http://localhost:80 > cloudflared.log 2>&1 &
      echo "Túnel iniciado. Consulta cloudflared.log para la URL pública."
      sleep 2
      grep -m1 -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' cloudflared.log && echo "Copia y pega esa URL en tu navegador para acceder desde cualquier lugar."
    fi
  fi

  pause
}