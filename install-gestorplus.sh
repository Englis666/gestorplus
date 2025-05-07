set -e 

echo " Instalando Gestorplus ... "
# Comprobar si estamos en Ubuntu o Arch usando /etc/os-release
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
    echo  "La carpeta 'gestorplus' ya existe. Usando carpeta existente..."
else 
    echo "Clonando GestorPlus..."
    git clone https://github.com/Englis666/gestorplus.git
fi

cd gestorplus

echo " Levantando contenedores de Docker..."
sudo docker-compose up -d --build

sleep 25

filename=$(zenity --file-selection --title="Selecciona el excel o base de datos que quieras migrar" --file-filter="*.xlsx *.xls *.csv")

if [ -z "$filename" ]; then
    zenity --error --text="No se seleccionó ningún archivo"
    exit 1
fi

echo "Ejecutando migracion de archivo : $filename"
php backend/migrations/MigrarExcelRunner.php "$filename"
echo "Migracion completa"

echo "Creando usuario administrador..."
sudo docker exec -it gestorplus-php php backend/migrations/CrearAdministrador.php

echo " GestorPlus está listo. Accede en http://localhost:3000"
echo " Usuario Admin num_doc = 1014736 | password 123"
