<?php
$backup_file = '/ruta/a/backup.sql';
$command = "mysqldump -u root -p gestorplus > $backup_file";
system($command);
echo 'Copia de seguridad realizada correctamente.';
?>
