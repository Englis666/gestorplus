<?php
declare(strict_types=1);

use Core\Routing\Router;
use Controller\AuthController;
use Service\TokenService;
use Dotenv\Dotenv;

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$router = new Router();

$router->post('/auth/registrar', function($data) {
    $authController = new AuthController();
    $authController->registrar($data);
});

$router->post('/auth/iniciar', function($data) {
    $authController = new AuthController();
    $authController->iniciar($data);
});

$router->get('/perfil', function() {
    $tokenService = new TokenService();
    $payload = $tokenService->validarToken();
    if (!$payload) {
        header('HTTP/1.1 401 Unauthorized');
        echo json_encode(['error' => 'Token inválido']);
        return;
    }
    echo json_encode(['message' => 'Perfil autorizado', 'user' => $payload->data]);
});

$router->handle($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI'], file_get_contents('php://input'));
