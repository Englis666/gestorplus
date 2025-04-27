<?php

namespace Core;

use Core\Controller\ControllerFactory; 

class Router
{
    private $controllers;

    public function __construct()
    {
        $this->controllers = ControllerFactory::createControllers();
    }
    public function route($method, $action, $data)
{
    $routeFile = __DIR__ . "/../routes/{$method}.php";  

    if (file_exists($routeFile)) {
        $routes = include $routeFile;
    } else {
        http_response_code(500);
        echo json_encode(['message' => "No se encontró el archivo de rutas para el método {$method}."]);
        exit;
    }

    if (isset($routes[$action])) {
        [$controllerKey, $methodToCall] = $routes[$action];

        if (method_exists($this->controllers[$controllerKey], $methodToCall)) {
            $this->controllers[$controllerKey]->$methodToCall($data);
            exit;
        } else {
            http_response_code(500);
            echo json_encode([
                'message' => 'El método no existe en el controlador.',
                'controller' => $controllerKey,
                'method' => $methodToCall
            ]);
            exit;
        }
    } else {
        http_response_code(404);
        echo json_encode([
            'message' => 'Acción no encontrada.',
            'method' => $method,
            'action' => $action,
            'routes' => array_keys($routes)
        ]);
        exit;
    }
}


}
