#!/bin/bash

echo "📥 Clonando el repositorio completo de GestorPlus..."

git clone https://github.com/Englis666/gestorplus.git || {
  echo "❌ Error al clonar el repositorio"
  exit 1
}

cd gestorplus
chmod +x install-gestorplus.sh

echo "🚀 Ejecutando install-gestorplus.sh..."
./install-gestorplus.sh