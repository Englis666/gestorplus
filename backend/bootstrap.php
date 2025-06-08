<?php

use Core\Router;

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$action = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$action = preg_replace('/^\/api\//', '', $action);


if (!$action || $action === '/' || $action === '') {
    http_response_code(400);
    echo json_encode(['message' => 'Recurso no especificado.']);
    exit;
}

$router = new Router();
$router->route($method, $action, $data);