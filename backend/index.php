<?php

// Permite solicitudes desde localhost:3000
header("Access-Control-Allow-Origin: http://localhost:3000");

// Permite ciertos métodos HTTP
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Permite ciertos encabezados
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Permite credenciales (cookies, cabeceras de autenticación, etc.)
header("Access-Control-Allow-Credentials: true");

// Si el navegador hace una solicitud OPTIONS, respondemos con un 200 OK
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
header("Content-Type: application/json; charset=UTF-8");


require_once 'vendor/autoload.php';
require_once 'servidor/servidor.php';
?>