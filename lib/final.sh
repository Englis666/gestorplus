function final_messages() {
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo "█                                                                           █"
  echo "█     🎉🎉🎉  ¡FELICIDADES! ¡GestorPlus está completamente instalado!  🎉🎉🎉   █"
  echo "█                                                                           █"
  echo "█████████████████████████████████████████████████████████████████████████████"
  echo ""

  read -rp "¿Te gustaría abrir los puertos necesarios para acceder a GestorPlus desde otras máquinas? (s/n): " abrir_puertos

  if [[ "$abrir_puertos" =~ ^[sS]$ ]]; then
    read -rp "¿Estás instalando en modo producción (Nginx sirve todo por el puerto 80)? (s/n): " es_produccion
    if [[ "$es_produccion" =~ ^[sS]$ ]]; then
      echo "Abriendo puertos 80 (HTTP) y 443 (HTTPS)..."
      sudo ufw allow 80/tcp
      sudo ufw allow 443/tcp
    else
      echo "No se abrirán puertos 80 y 443 porque no estás en modo producción."
    fi
    sudo ufw reload
    echo "Puertos abiertos correctamente."
  else
    echo "No se abrieron puertos automáticamente. Si necesitas acceso externo, ábrelos manualmente."
  fi

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
  pause
}