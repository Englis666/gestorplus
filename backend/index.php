<?php
$allowed_origins = [
    'http://localhost:3000',
    'https://midominio.com'
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-estudio-id, x-experiencia-id");
header("Access-Control-Allow-Credentials: true");
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}
require_once './bootstrap.php';
?>
