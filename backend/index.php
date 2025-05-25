<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

use Core\Router;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-estudio-id, x-experiencia-id");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-estudio-id, x-experiencia-id");
    header("Access-Control-Allow-Credentials: true");
    exit;
}


header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? ($data['action'] ?? null);

if (!$action) {
    http_response_code(400);
    echo json_encode(['message' => 'No se recibió la acción.']);
    exit;
}

$router = new Router(); 


$router->route($method, $action, $data);

?>
