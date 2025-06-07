
function clone_or_use_repo() {
  echo -e "📦 Paso 4: Verificando el código fuente de GestorPlus en tu equipo..."

  if [ -d "frontend" ] && [ -d "backend" ]; then
    echo -e "✔️  El código fuente ya está presente en la carpeta actual. No es necesario clonar nada."
    pause
    return
  fi

  echo -e "❌ No se encontraron las carpetas necesarias (frontend/backend) en la carpeta actual."
  echo -e "Por favor, descarga el código fuente manualmente o usa el instalador completo."
  exit 1
}