<?php

use Core\Router;

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? ($data['action'] ?? null);

if (!$action) {
    http_response_code(400);
    echo json_encode(['message' => 'Se encontro el recurso.']);
    exit;
}

$router = new Router();
$router->route($method, $action, $data);