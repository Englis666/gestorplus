<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

$url = 'URL de gestorplus';
$response = @file_get_contents($url);

if ($response !== false) {
    echo 'El despliegue fue exitoso. La aplicación es accesible.';
} else {
    echo 'El despliegue falló. La aplicación no es accesible.';
}
?>
