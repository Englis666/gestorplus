<?php
use Controlador\ArchivosControlador;

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null; 

$controller = [
    'archivos' => new ArchivosControlador(),
];

$routes = [
    'POST' => [
        'subirContrato' => ['archivos', 'subirContrato'],
    ],
    'GET' => [
        'obtenerContrato' => ['archivos', 'obtenerContrato'],
    ]
];

$data = ($method === 'POST') ? json_decode(file_get_contents('php://input'), true) : null;

if (isset($routes[$method][$action])) {
    [$controllerKey, $methodName] = $routes[$method][$action];

    $controller[$controllerKey]->$methodName($data);
} else {
    header("Content-Type: application/json");
    http_response_code(400);
    echo json_encode(['message' => 'Acción no encontrada']);
}
?> 
