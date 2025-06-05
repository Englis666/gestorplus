#!/bin/bash

echo "📥 Clonando sólo lo necesario del repositorio GestorPlus..."

git clone --filter=blob:none --no-checkout https://github.com/Englis666/gestorplus.git
cd gestorplus || { echo "❌ Error al entrar a la carpeta gestorplus"; exit 1; }

git sparse-checkout init --cone

git sparse-checkout set lib install-gestorplus.sh
git checkout

chmod +x install-gestorplus.sh

echo "🚀 Ejecutando install-gestorplus.sh..."
./install-gestorplus.sh
