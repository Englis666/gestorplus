# Script de CalcularHorasExtra.php
Este script debe ser programado en la computadara instalada en caso de linux se usara crontab -e

# PASOS 
1. crontab -e

2. Luego se debe agregar esta linea para ejecutar el PHP todos los dias a una cierta hora (12:00 AM ) por ejemplo

0 0  * * * /usr/bin/php /var/www/gestorplus/backend/scripts/calcularHorasExtra.php

#0 0 * * *: Ejecuta el script a las 12:00 AM todos los días.
#/usr/bin/php: Asegúrate de que esta es la ruta correcta a PHP en tu servidor.
#/var/www/gestorplus/backend/scripts/calcularHorasExtra.php: La ruta completa al archivo PHP.

# En caso de Windows
    Abre el Programador de Tareas y crea una nueva tarea.

    Configura el desencadenador para que se ejecute todos los días a las 12:00 AM.

    En la acción, selecciona ejecutar el archivo PHP (por ejemplo, C:\xampp\php\php.exe) con el argumento que apunte al archivo PHP que quieres ejecutar (por ejemplo, C:\ruta\a\tu\script\horas_extra_automatica.php).

Con esto, el script se ejecutará automáticamente cada día sin necesidad de intervención manual.