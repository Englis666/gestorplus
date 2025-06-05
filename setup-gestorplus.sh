#!/bin/bash

echo "📥 Clonando sólo lo necesario del repositorio GestorPlus..."

# Clona en una carpeta temporal
git clone --filter=blob:none --no-checkout https://github.com/Englis666/gestorplus.git temp-gestorplus
cd temp-gestorplus || { echo "❌ Error al entrar a la carpeta temp-gestorplus"; exit 1; }

git sparse-checkout init --cone
git sparse-checkout set lib install-gestorplus.sh
git checkout

# Mueve los archivos a la carpeta superior y elimina el temporal
mv install-gestorplus.sh ../
mv lib ../
cd ..
rm -rf temp-gestorplus

chmod +x install-gestorplus.sh

echo "🚀 Ejecutando install-gestorplus.sh..."
./install-gestorplus.sh