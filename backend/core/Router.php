<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Core;

use Predis\Client as RedisClient;
use Core\Controllers\ControllerFactory;

class Router {
    private $controllers;
    private $redis;
    private $maxRequest = 100;
    private $timeWindow = 60;

    public function __construct() {
        $this->controllers = ControllerFactory::createControllers();
        $this->redis = new RedisClient([
            'scheme' => 'tcp',
            'host' => 'gestorplus-redis',
            'port' => 6379,
        ]);
    }

    private function checkRateLimit($ip) {
        $currentTime = time();
        $key = "rate_limit:{$ip}";

        $pipe = $this->redis->pipeline();

        $pipe->zremrangebyscore($key, 0, $currentTime - $this->timeWindow);
        $pipe->zadd($key, [$currentTime => $currentTime]);
        $pipe->expire($key, $this->timeWindow);

        $pipe->exec();

        $requestCount = $this->redis->zcard($key);

        if ($requestCount >= $this->maxRequest) {
            $this->sendCorsHeaders();
            http_response_code(429);
            echo json_encode(['message' => 'Demasiadas solicitudes. Intenta más tarde']);
            exit;
        }
    }

    private function getRoutes($method) {
        $cacheKey = "routes:{$method}";
        $routes = $this->redis->get($cacheKey);

        if (!$routes) {
            $routeFile = __DIR__ . "/../routes/{$method}.php";

            if (file_exists($routeFile)) {
                $routes = include $routeFile;
                $this->redis->setex($cacheKey, 3600, serialize($routes));
            } else {
                http_response_code(500);
                echo json_encode(['message' => "No se encontró el archivo de rutas para el método {$method}."]);
                exit;
            }
        } else {
            $routes = unserialize($routes);
        }

        return $routes;
    }

    private function sendCorsHeaders() {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed_origins = [
    'http://localhost:3000',
    'https://gestorplus.codeadvance.com',
    'https://gestorplus.codeadvance.com:3000',
    ];
      
        $allowed_origins = array_map('strtolower', $allowed_origins);
        $origin = strtolower($origin);
        // Si el origen está permitido, establece los encabezados CORS

        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: $origin");
            header("Access-Control-Allow-Credentials: true");
        }

        header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-estudio-id, x-experiencia-id");
        header("Content-Type: application/json; charset=UTF-8");
    }

    public function route($method, $action, $data) {
        $this->sendCorsHeaders();

        if ($method === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $this->checkRateLimit($clientIp);

        $routes = $this->getRoutes($method);

        if (isset($routes[$action])) {
            [$controllerKey, $methodToCall] = $routes[$action];

            if (method_exists($this->controllers[$controllerKey], $methodToCall)) {
                $this->controllers[$controllerKey]->$methodToCall($data);
                exit;
            } else {
                $this->sendCorsHeaders();
                http_response_code(500);
                echo json_encode([
                    'message'    => 'El método no existe en el controlador.',
                    'controller' => $controllerKey,
                    'method'     => $methodToCall
                ]);
                exit;
            }
        } else {
            $this->sendCorsHeaders();
            http_response_code(404);
            echo json_encode([
                'message' => 'Recurso no encontrado.',
                'method'  => $method,
                'action'  => $action,
                'routes'  => array_keys($routes)
            ]);
            exit;
        }
    }
}
