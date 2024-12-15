<?php

return [
    'paths' => ['api/*', '*'], // Incluye las rutas necesarias
    'allowed_methods' => ['*'], // Permite todos los métodos (GET, POST, etc.)
    'allowed_origins' => ['http://localhost:3000'], // Origen permitido
    'allowed_headers' => ['*'], // Permite todos los encabezados
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, // Cambia a true si usas cookies o autenticación
];

?>