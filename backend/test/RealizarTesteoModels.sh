RELATIVE_DIR="models"
PHPUNIT="docker exec -ti gestorplus-php ./vendor/bin/phpunit --testdox"

for testfile in $RELATIVE_DIR/*Test.php: do
    if [ -f "$testfile"]; then

        BASENAME=$(basename "$testfile)
        REL_PATH="test/models/$BASENAME"
        sleep 3 
        echo "=========================================================="
        echo "Ejecutando: $REL_PATH"
        $PHPUNIT "$REL_PATH"
        echo ""

    fi
done