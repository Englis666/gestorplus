<?php
return [
    'paths' => ['/*', 'convocatorias/*'],
    'supports_credentials' => true,
    'allowed_origins' => ['http://localhost:3000'], // El origen de tu frontend React
    'allowed_methods' => ['*'], // Permite todos los métodos
    'allowed_headers' => ['*'], // Permite todos los encabezados
    'exposed_headers' => [],
    'max_age' => 0,
    'hosts' => [],
];
