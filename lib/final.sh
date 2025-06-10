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
    echo "Configurando Cloudflare Tunnel para exponer GestorPlus a Internet..."
    echo "Asegúrate de tener una cuenta de Cloudflare y haber instalado cloudflared."
     
    if ! command -v cloudflared >/dev/null 2>&1; then
      echo "cloudflared no está instalado. Instálalo antes de continuar."
      echo "En Ubuntu/Debian: sudo apt install cloudflared"
      echo "En Arch: sudo pacman -S cloudflared"
    else
      echo "Iniciando Cloudflare Tunnel. Espera la URL pública aquí abajo (Ctrl+C para salir del túnel cuando termines):"    
      cloudflared tunnel --url http://localhost:80 --loglevel debug &
    fi
  fi

  pause
}