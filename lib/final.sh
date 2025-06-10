function final_messages() {
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo "█                                                                           █"
  echo "█     🎉🎉🎉  ¡FELICIDADES! ¡GestorPlus está completamente instalado!  🎉🎉🎉   █"
  echo "█                                                                           █"
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo ""

  echo ""
  echo "Puedes abrir GestorPlus en tu navegador favorito en esta dirección:"
  echo "  http://localhost si estas en el mismo equipo"
  echo " http://localhost:3000 si estas en desarrollo"
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
    sudo ufw allow 80/tcp
    sudo ufw reload

    if ! command -v cloudflared >/dev/null 2>&1; then
      echo "cloudflared no está instalado. Instálalo antes de continuar."
      echo "En Ubuntu/Debian: sudo apt install cloudflared"
      echo "En Arch: sudo pacman -S cloudflared"
    else
      echo ""
      echo "Para iniciar el túnel, ejecuta el siguiente comando:"
      echo "  cloudflared tunnel --url http://localhost:80"
      echo ""
      echo "Esto expondrá GestorPlus a Internet. Asegúrate de que tu dominio esté configurado en Cloudflare."
      echo "Cuando termines, puedes cerrar el túnel con Ctrl+C."
    fi
  fi

  pause
}