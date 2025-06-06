# EjecutarPruebasUnitarias.sh
 # Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 # Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
#
RELATIVE_DIR="controllers"
PHPUNIT="docker exec -ti gestorplus-php ./vendor/bin/phpunit --testdox"

ALL_OK=true

for testfile in $RELATIVE_DIR/*Test.php; do
  if [ -f "$testfile" ]; then
    BASENAME=$(basename "$testfile")
    REL_PATH="test/controllers/$BASENAME"
    sleep 1.5
    echo "=========================================================="
    echo "Ejecutando: $REL_PATH"
    $PHPUNIT "$REL_PATH"
    if [ $? -ne 0 ]; then
      ALL_OK=false
    fi
    echo ""
    echo "Controladores Finalizados" 
    echo "=========================================================="
  else
    echo "No se encontró el archivo de prueba: $testfile"
    ALL_OK=false
  fi
done

if [ $ALL_OK ]; then
clear
  cat <<'EOF'
 ____ ___   _   _ _____ ____   ___  _     _     _____ ____  ____
/ ___ / _ \| \ | |_   _|  _ \ / _ \| |   | |   | ____|  _ \/ ___|
| |  | | | |  \| | | | | |_) | | | | |   | |   |  _| | |_) \___ \
| |__| |_| | |\  | | | |  _ <| |_| | |___| |___| |___|  _ < ___) |
 \____\___/|_| \_| |_| |_| \_\\___/|_____|_____|_____|_| \_\____/

 _____ _   _ _   _  ____ ___ ___  _   _    _    _     _____ ____
|  ___| | | | \ | |/ ___|_ _/ _ \| \ | |  / \  | |   | ____/ ___|
| |_  | | | |  \| | |    | | | | |  \| | / _ \ | |   |  _| \___ \
|  _| | |_| | |\  | |___ | | |_| | |\  |/ ___ \| |___| |___ ___) |
|_|    \___/|_| \_|\____|___\___/|_| \_/_/   \_\_____|_____|____/

EOF
sleep 2
else
  echo "Algunos controladores no pasaron las pruebas unitarias."
  echo "Por favor, revisa los errores y vuelve a intentarlo."
  sleep 3
  exit 1
fi

echo "Ahora se procedera a ejecutar los modelos de pruebas unitarias"

echo "Ejecutando pruebas unitarias de modelos..."
RELATIVE_DIR="models"
PHPUNIT="docker exec -ti gestorplus-php ./vendor/bin/phpunit --testdox"

for testfile in $RELATIVE_DIR/*Test.php; do
    if [ -f "$testfile" ]; then
        BASENAME=$(basename "$testfile")
        REL_PATH="test/models/$BASENAME"
        sleep 3 
        echo "=========================================================="
        echo "Ejecutando: $REL_PATH"
        $PHPUNIT "$REL_PATH"
        if [ $? -ne 0 ]; then
            ALL_OK=false
        fi
        echo ""
        echo "Models Finalizado"
        echo "====================================="
    else 
        echo "No se encontro el archivo de Model De Pueba Unitaria llamado: $testfile"
        ALL_OK=false
    fi
done

if [ $ALL_OK ]; then
sleep 2
    clear
    cat <<'EOF'
 __  __  ___  ____  _____ _     ____
|  \/  |/ _ \|  _ \| ____| |   / ___|
| |\/| | | | | | | |  _| | |   \___ \
| |  | | |_| | |_| | |___| |___ ___) |
|_|  |_|\___/|____/|_____|_____|____/

 _____ _   _ _   _  ____ ___ ___  _   _    _    _     _____ ____
|  ___| | | | \ | |/ ___|_ _/ _ \| \ | |  / \  | |   | ____/ ___|
| |_  | | | |  \| | |    | | | | |  \| | / _ \ | |   |  _| \___ \
|  _| | |_| | |\  | |___ | | |_| | |\  |/ ___ \| |___| |___ ___) |
|_|    \___/|_| \_|\____|___\___/|_| \_/_/   \_\_____|_____|____/
EOF
fi
echo "Pruebas de modelos finalizadas."
sleep 3
clear
# Verificar si todas las pruebas de modelos pasaron
sleep 2
if [ $ALL_OK ]; then
  cat <<'EOF'
 ____  ____  __    ____ ___  _   __     _    ____  ____ ____     _____ _   _
|  ___| ____| |   |_ _/ ___|_ _|  _ \  / \  |  _ \| ____/ ___|  |_   _| | | |
| |_  |  _| | |    | | |    | || | | |/ _ \ | | | |  _| \___ \    | | | | | |
|  _| | |___| |___ | | |___ | || |_| / ___ \| |_| | |___ ___) |   | | | |_| |
|_|   |_____|_____|___\____|___|____/_/   \_\____/|_____|____/    |_|  \___/

 ____   ___  _____ _______        ___    ____  _____   _____ ____ _____  _
/ ___| / _ \|  ___|_   _\ \      / / \  |  _ \| ____| | ____/ ___|_   _|/ \
\___ \| | | | |_    | |  \ \ /\ / / _ \ | |_) |  _|   |  _| \___ \ | | / _ \
 ___) | |_| |  _|   | |   \ V  V / ___ \|  _ <| |___  | |___ ___) || |/ ___ \
|____/ \___/|_|     |_|    \_/\_/_/   \_\_| \_\_____| |_____|____/ |_/_/   \_\

 _     ___ ____ _____ ___    ____   _    ____      _
| |   |_ _/ ___|_   _/ _ \  |  _ \ / \  |  _ \    / \
| |    | |\___ \ | || | | | | |_) / _ \ | |_) |  / _ \
| |___ | | ___) || || |_| | |  __/ ___ \|  _ <  / ___ \
|_____|___|____/ |_| \___/  |_| /_/   \_\_| \_\/_/   \_\

 ____  ____   ___  ____  _   _  ____ ____ ___ ___  _   _
|  _ \|  _ \ / _ \|  _ \| | | |/ ___/ ___|_ _/ _ \| \ | |
| |_) | |_) | | | | | | | | | | |  | |    | | | | |  \| |
|  __/|  _ <| |_| | |_| | |_| | |__| |___ | | |_| | |\  |
|_|   |_| \_\\___/|____/ \___/ \____\____|___\___/|_| \_|
EOF
docker exec -ti gestorplus-php ./vendor/bin/phpunit --testdox-html=test/html/report.html
"Se genero un html con la informacion de los controladores y modelos"
sleep 6
exit 0

else
  echo "Algunas pruebas unitarias de modelos no han pasado. Por favor, revisa los errores."
  exit 1
fi