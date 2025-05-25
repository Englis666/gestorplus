<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

$backup_file = '/ruta/a/backup.sql';
$command = "mysqldump -u root -p gestorplus > $backup_file";
system($command);
echo 'Copia de seguridad realizada correctamente.';
?>
