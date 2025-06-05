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
    echo -e "Ejecutando ${CYAN}npm run build${RESET} para compilar el frontend..."
    npm run build || {
      echo -e "${RED}¡Problemas al compilar el frontend!${RESET}"
      exit 1
    }
    mkdir -p ../backend/public
    cp -r build/* ../backend/public/ || {
      echo -e "${RED}¡No pude copiar los archivos compilados al backend! ¿Todo bien con las rutas?${RESET}"
      exit 1
    }
    cd ..
    echo -e "${GREEN}✨ ¡El frontend de GestorPlus está listo para brillar!${RESET}"
  else
    echo -e "${RED}¡No encuentro la carpeta 'frontend' dentro de 'gestorplus'! ¿Se descargó todo bien?${RESET}"
    exit 1
  fi
  pause
}
