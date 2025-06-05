function install_frontend() {
  echo -e "${YELLOW}💻 Paso 5: ¡Preparando la parte visual de GestorPlus (el frontend)!${RESET}"
  echo "Esto es como armar un rompecabezas, ¡con muchas piezas (paquetes de Node.js)!"
  if [ -d "frontend" ]; then
    cd frontend || {
      echo -e "${RED}¡No pude entrar a la carpeta 'frontend'! ¿El código está completo?${RESET}"
      exit 1
    }
    echo -e "Ejecutando ${CYAN}npm install${RESET} para que todo encaje..."
    npm install || {
      echo -e "${RED}¡Problemas al instalar las dependencias del frontend! ¿npm está bien?${RESET}"
      exit 1
    }

    echo -e "${YELLOW}¿Para qué entorno quieres compilar el frontend?${RESET}"
    echo "  ${BLUE}1) Producción${RESET} (optimizado, minificado, listo para usuarios finales)"
    echo "  ${BLUE}2) Desarrollo${RESET} (más rápido, con mapas de fuente y debugging)"
    read -rp "$(echo -e "${CYAN}Elige una opción (1 o 2): ${RESET}")" build_choice

    # ...existing code...
    if [[ "$build_choice" == "1" ]]; then
      echo -e "${YELLOW}No se ejecuta 'npm run start' porque el frontend se levanta con Docker.${RESET}"
      cd ..
      echo -e "${GREEN}✨ ¡Listo! El frontend se levantará con Docker en el siguiente paso.${RESET}"
    elif [[ "$build_choice" == "2" ]]; then
      build_cmd="npm run build"
      echo -e "Ejecutando ${CYAN}${build_cmd}${RESET} para compilar el frontend..."
      $build_cmd || {
        echo -e "${RED}¡Problemas al compilar el frontend!${RESET}"
        exit 1
      }
      mkdir -p ../backend/public
      cp -r build/* ../backend/public/ || {
        echo -e "${RED}¡No pude copiar los archivos compilados al backend! ¿Todo bien con las rutas?${RESET}"
        exit 1
      }
      cd ..
      echo -e "${GREEN}✨ ¡El frontend de GestorPlus está listo para producción!${RESET}"
    else
      echo -e "${RED}Opción inválida. Cancela la compilación del frontend.${RESET}"
      cd ..
      exit 1
    fi
  else
    echo -e "${RED}¡No encuentro la carpeta 'frontend'! ¿Se descargó todo bien?${RESET}"
    exit 1
  fi
  pause
}