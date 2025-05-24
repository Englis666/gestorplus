# Para ejecutar pruebas con php UNIT es con

docker exec -it gestorplus-php vendor/bin/phpunit
Ya que el proyecto se esta trabajando con docker desde el docker se ejecuta el phpunit dentro del docker
./vendor/bin/phpunit --testdox
o
  
```bash
docker exec -ti gestorplus-php ./vendor/bin/phpunit --testdox

# Ejecutar para generar el reporte

docker exec -ti gestorplus-php ./vendor/bin/phpunit --testdox-html=test/html/report.html

