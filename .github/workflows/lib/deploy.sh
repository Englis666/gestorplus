ockeecho " Actualizando el codig fuente de GestorPlus..."
git pull origin main || { echo "Error al hacer git pull"; exit 1; }

echo "Reconstruyendo contenedores (Si es necesario)..."
docker compose build docker-compose..prod.yml || { echo "Error al reconstruir contenedores"; exit 1; }

echo "Levantando Servicios..."
docker compose -f docker-compose.prod.yml up -d || { echo "Error al levantar servicios"; exit 1; }
echo "Esperando a que los servicios estén listos..."
sleep 1
echo "Verificando el estado de los servicios..."
docker compose -f docker-compose.prod.yml ps || { echo "Error al verificar el estado de los servicios"; exit 1; }
echo "Servicios levantados correctamente."

echo "Desliegue correcto de GestorPlus."