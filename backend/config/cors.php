<?php

return [
    'paths' => ['api/*', '/*'], // Asegúrate de que se incluye el patrón de rutas que usas en tu API
    'allowed_methods' => ['*'], // Permite todos los métodos HTTP
    'allowed_origins' => ['*'], // Permite solicitudes desde cualquier origen (puedes restringirlo a tus dominios específicos)
    'allowed_headers' => ['*'], // Permite cualquier cabecera
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];


?>