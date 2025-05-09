<?php
$url = 'URL de gestorplus';
$response = @file_get_contents($url);

if ($response !== false) {
    echo 'El despliegue fue exitoso. La aplicación es accesible.';
} else {
    echo 'El despliegue falló. La aplicación no es accesible.';
}
?>
