<?php

use Core\Router;

require_once __DIR__ . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-estudio-id, x-experiencia-id");
    header("Access-Control-Allow-Credentials: true");
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

// Cargar variables de entorno si usas .env
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
// $dotenv->load();

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