#!/bin/bash

REPO_URL="https://github.com/Englis666/gestorplus.git"
DIR="gestorplus"

echo "📥 Preparando entorno para GestorPlus..."

if [ -d "$DIR" ]; then
  echo "📂 La carpeta '$DIR' ya existe. Actualizando repositorio..."
  cd "$DIR"
  git pull || {
    echo "❌ Error al hacer git pull. Revisa la conexión o los permisos."
    exit 1
  }
else
  echo "📥 Clonando el repositorio completo de GestorPlus..."
  git clone "$REPO_URL" || {
    echo "❌ Error al clonar el repositorio. Asegúrate de tener Git instalado y de que la URL sea correcta."
    exit 1
  }
  cd "$DIR"
fi

chmod +x install-gestorplus.sh

echo "🚀 Ejecutando install-gestorplus.sh..."
./install-gestorplus.sh