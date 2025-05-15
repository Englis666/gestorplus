#!/bin/bash
set -e

if ! docker info >/dev/null 2>&1; then
    echo "❌ Tu usuario no tiene permisos para usar Docker. Ejecuta el script con sudo o agrégate al grupo docker:"
    echo "   sudo usermod -aG docker \$USER && newgrp docker"
    exit 1
fi

echo "📦 Instalando GestorPlus ..."

if grep -q "Ubuntu" /etc/os-release; then
    echo "🟢 Detectado Ubuntu"
    sudo apt update
    sudo apt install -y docker.io docker-compose git
elif grep -q "Arch" /etc/os-release; then
    echo "🟢 Detectado Arch Linux"
    sudo pacman -S --noconfirm docker docker-compose git
else
    echo "❌ Sistema Operativo no compatible"
    exit 1
fi

sudo systemctl enable docker
sudo systemctl start docker

if [ -d "gestorplus" ]; then
    echo "📁 La carpeta 'gestorplus' ya existe. Usando carpeta existente..."
else 
    echo "🔄 Clonando repositorio GestorPlus..."
    git clone https://github.com/Englis666/gestorplus.git

    if [ -d "gestorplus/backend/test" ]; then
        echo "🧹 Eliminando carpeta de pruebas (solo para desarrolladores)..."
        rm -rf gestorplus/test
    fi
fi

cd gestorplus

echo "🐳 Levantando contenedores de Docker..."
docker-compose up -d --build

sleep 25

# 🔽 Pregunta si desea realizar la migración del Excel
read -p "¿Deseas migrar un archivo Excel/CSV ahora? [s/n]: " migrar_excel

if [[ "$migrar_excel" =~ ^[sS]$ ]]; then
    if command -v zenity >/dev/null 2>&1; then
        filename=$(zenity --file-selection --title="Selecciona el archivo Excel/CSV para migrar" --file-filter="*.xlsx *.xls *.csv")
    else
        read -p "Ingresa la ruta del archivo Excel/CSV para migrar: " filename
    fi

    if [ -z "$filename" ]; then
        echo "⚠️ No se seleccionó ningún archivo. Se omite la migración."
    else
        echo "📤 Copiando archivo al contenedor..."
        docker cp "$filename" gestorplus-php:/app/tmp_migrar.xlsx

        echo "🔄 Ejecutando migración del archivo: $filename"
        docker exec gestorplus-php php migrations/MigrarExcelRunner.php /app/tmp_migrar.xlsx
        echo "✅ Migración completa"
    fi
else
    echo "⏭️ Migración de Excel omitida"
fi

echo "👤 Creando usuario administrador..."
docker exec -it gestorplus-php php migrations/CrearAdministrador.php

echo ""
echo "✅ GestorPlus está listo. Accede en: http://localhost:3000"
echo "🧑 Usuario Admin: num_doc = 898989 | password = 123456789"
