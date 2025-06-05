#!/bin/bash

DEST="carpetaDeInstalacion"

echo "📥 Clonando sólo lo necesario del repositorio GestorPlus..."

# Crea la carpeta destino si no existe
mkdir -p "$DEST"

# Clona en una carpeta temporal
git clone --filter=blob:none --no-checkout https://github.com/Englis666/gestorplus.git temp-gestorplus
cd temp-gestorplus || { echo "❌ Error al entrar a la carpeta temp-gestorplus"; exit 1; }

git sparse-checkout init --cone
git sparse-checkout set lib install-gestorplus.sh
git checkout

# Mueve los archivos a la carpeta destino y elimina el temporal
mv install-gestorplus.sh "../$DEST/"
mv lib "../$DEST/"
cd ..
rm -rf temp-gestorplus

cd "$DEST"
chmod +x install-gestorplus.sh

echo "🚀 Ejecutando install-gestorplus.sh..."
./install-gestorplus.sh