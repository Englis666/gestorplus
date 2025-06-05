#!/bin/bash

echo "📥 Clonando el repositorio completo de GestorPlus..."

git clone https://github.com/Englis666/gestorplus.git || {
  echo "❌ Error al clonar el repositorio. Asegúrate de tener Git instalado y de que la URL sea correcta."
  exit 1
}

cd gestorplus
chmod +x install-gestorplus.sh

echo "🚀 Ejecutando install-gestorplus.sh..."
./install-gestorplus.sh