function final_messages() {
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo "█                                                                           █"
  echo "█     🎉🎉🎉  ¡FELICIDADES! ¡GestorPlus está completamente instalado!  🎉🎉🎉   █"
  echo "█                                                                           █"
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo ""

  echo ""
  echo "Puedes abrir GestorPlus en tu navegador favorito en esta dirección:"
  echo "  http://localhost"
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
      LOG_PATH="/tmp/cloudflared.log"
      echo "Iniciando Cloudflare Tunnel en segundo plano..."
      nohup cloudflared tunnel --url http://localhost:80 > "$LOG_PATH" 2>&1 &
      echo "Túnel iniciado. Consulta $LOG_PATH para la URL pública."
      sleep 5
      url_cloudflare=$(grep -m1 -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' "$LOG_PATH")
      if [[ -n "$url_cloudflare" ]]; then
        echo "Accede desde cualquier lugar usando:"
        echo "  $url_cloudflare"
      else
        echo "La URL pública aún no está disponible. Consulta $LOG_PATH en unos segundos."
      fi
    fi
  fi

  pause
}