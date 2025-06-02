#!/bin/bash
RELATIVE_DIR="controllers"
PHPUNIT="docker exec -ti gestorplus-php ./vendor/bin/phpunit --testdox"

ALL_OK=true

for testfile in $RELATIVE_DIR/*Test.php; do
  if [ -f "$testfile" ]; then
    BASENAME=$(basename "$testfile")
    REL_PATH="test/controllers/$BASENAME"
    sleep 2
    echo "=========================================================="
    echo "Ejecutando: $REL_PATH"
    $PHPUNIT "$REL_PATH"
    if [ $? -ne 0 ]; then
      ALL_OK=false
    fi
    echo ""
  fi
done

if $ALL_OK; then
  clear
  echo "==============================================="
  echo "   ____            _       _           _       "
  echo "  / ___| ___ _ __ (_)_ __ | |__   ___ | |_ ___ "
  echo " | |  _ / _ \ '_ \| | '_ \| '_ \ / _ \| __/ _ \\"
  echo " | |_| |  __/ | | | | |_) | | | | (_) | ||  __/"
  echo "  \____|\___|_| |_|_| .__/|_| |_|\___/ \__\___|"
  echo "                   |_|                         "
  echo "                                               "
  echo " ¡Todos los controladores están listos para producción!"
  echo "==============================================="
fi