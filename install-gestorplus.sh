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
    sudo apt install -y docker.io docker-compose git npm
elif grep -q "Arch" /etc/os-release; then
    echo "🟢 Detectado Arch Linux"
    sudo pacman -S --noconfirm docker docker-compose git npm
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
        rm -rf gestorplus/backend/test
    fi
fi

cd gestorplus/frontend

if ! command -v npm >/dev/null 2>&1; then
    echo "❌ npm no está instalado. Por favor instálalo para continuar."
    exit 1
fi

npm install

cd ..

echo "🛠️ ¿Qué entorno deseas usar?"
echo "1) Desarrollo"
echo "2) Producción"
read -p "Selecciona una opción [1-2]: " opcion_entorno

if [[ "$opcion_entorno" == "1" ]]; then
    echo "🚀 Levantando contenedores en modo desarrollo..."
    docker compose --profile dev up --build -d
    perfil="dev"
elif [[ "$opcion_entorno" == "2" ]]; then
    echo "🚀 Levantando contenedores en modo producción..."
    docker compose --profile prod up --build -d
    perfil="prod"
else
    echo "❌ Opción inválida. Abortando."
    exit 1
fi

# Esperar unos segundos para que los contenedores estén listos
sleep 25

echo "🔍 Buscando nombre del contenedor PHP..."

container_name=$(docker ps --filter "ancestor=gestorplus-php" --format "{{.Names}}" | head -n1)

if [[ -z "$container_name" ]]; then
    # Intentar buscar por patrón alternativo (ajusta si tu contenedor tiene otro nombre)
    container_name=$(docker ps --format "{{.Names}}" | grep gestorplus | grep php | head -n1)
fi

if [[ -z "$container_name" ]]; then
    echo "❌ No se encontró el contenedor PHP activo. Abortando."
    exit 1
fi

echo "✅ Contenedor PHP encontrado: $container_name"

echo "🔽 ¿Deseas migrar un archivo Excel/CSV ahora?"
read -p "[s/n]: " migrar_excel

if [[ "$migrar_excel" =~ ^[sS]$ ]]; then
    if command -v zenity >/dev/null 2>&1 && [[ -n "$DISPLAY" ]]; then
        filename=$(zenity --file-selection --title="Selecciona el archivo Excel/CSV para migrar" --file-filter="*.xlsx *.xls *.csv")
    else
        read -p "📁 Ingresa la ruta del archivo Excel/CSV para migrar: " filename
    fi

    if [[ -z "$filename" ]]; then
        echo "⚠️ No se seleccionó ningún archivo. Se omite la migración."
    elif [[ ! -f "$filename" ]]; then
        echo "❌ El archivo '$filename' no existe. Se omite la migración."
    else
        echo "📤 Copiando archivo al contenedor..."
        docker cp "$filename" "$container_name":/app/tmp_migrar.xlsx

        echo "🔄 Ejecutando migración del archivo: $filename"
        docker exec "$container_name" php migrations/MigrarExcelRunner.php /app/tmp_migrar.xlsx
        echo "✅ Migración completa"
    fi
else
    echo "⏭️ Migración de Excel omitida"
fi

echo "👤 Creando usuario administrador..."
docker exec -it "$container_name" php migrations/CrearAdministrador.php

echo ""
if [[ "$perfil" == "prod" ]]; then
    echo "✅ GestorPlus está listo. Accede en: http://localhost"
else
    echo "✅ GestorPlus está listo. Accede en: http://localhost:3000"
fi

echo "🧑 Usuario Admin: num_doc = 898989 | password = 123456789"
