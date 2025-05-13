#!/bin/bash
set -e

echo " Instalando Gestorplus ... "

if grep -q "Ubuntu" /etc/os-release; then
    echo "Detectado Ubuntu ... "
    sudo apt update
    sudo apt install -y docker.io docker-compose git
elif grep -q "Arch" /etc/os-release; then
    echo "Detectado Arch Linux ... "
    sudo pacman -S --noconfirm docker docker-compose git
else
    echo "Sistema Operativo no compatible"
    exit 1
fi

sudo systemctl enable docker
sudo systemctl start docker

if [ -d "gestorplus" ]; then
    echo "La carpeta 'gestorplus' ya existe. Usando carpeta existente..."
else 
    echo "Clonando GestorPlus..."
    git clone https://github.com/Englis666/gestorplus.git
    
    if [ -d "gestorplus/backend/test" ]; then
        echo "Eliminando carpeta Privada (Solo es para desarolladores las pruebas)..."
        rm -rf gestorplus/test
    fi
fi

cd gestorplus

echo "Levantando contenedores de Docker..."
sudo docker-compose up -d --build

sleep 25

if command -v zenity >/dev/null 2>&1; then
    filename=$(zenity --file-selection --title="Selecciona el archivo Excel/CSV para migrar" --file-filter="*.xlsx *.xls *.csv")
else
    read -p "Ingresa la ruta del archivo Excel/CSV para migrar: " filename
fi

if [ -z "$filename" ]; then
    echo "No se seleccionó ningún archivo"
    exit 1
fi

# Toca corregir el copeo de la base de datos de excel (Ruta especifica a Docker) @param [@Stemansote]
docker cp "$filename" gestorplus-php:/app/tmp_migrar.xlsx

echo "Ejecutando migración del archivo: $filename"
sudo docker exec gestorplus-php php backend/migrations/MigrarExcelRunner.php /app/tmp_migrar.xlsx
echo "Migración completa"

echo "Creando usuario administrador..."2
sudo docker exec -it gestorplus-php php backend/migrations/CrearAdministrador.php

echo ""
echo "✅ GestorPlus está listo. Accede en http://localhost:3000"
echo "🧑 Usuario Admin num_doc = 898989 | password = 123456789"
