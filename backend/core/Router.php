<?php
namespace Core;

use Predis\Client as RedisClient;
use Core\Controllers\ControllerFactory;

class Router {
    private $controllers;
    private $redis;
    private $maxRequest = 100;
    private $timeWindow = 60;

    public function __construct()
    {
        $this->controllers = ControllerFactory::createControllers();
        $this->redis = new RedisClient([
            'scheme' => 'tcp',
            'host' => 'gestorplus-redis',
            'port' => 6379,
        ]);
    }

    private function checkRateLimit($ip)
    {
        $currentTime = time();
        $key = "rate_limit: {$ip}";

        $pipe = $this->redis->pipeline();

        // Comandos dentro del pipeline
        $pipe->zremrangebyscore($key, 0, $currentTime - $this->timeWindow);
        $pipe->zadd($key, [$currentTime => $currentTime]);
        $pipe->expire($key, $this->timeWindow);  // Configuramos la expiración

        // Ejecutamos todos los comandos de una vez
        $pipe->exec();

        // Obtener el número de solicitudes
        $requestCount = $this->redis->zcard($key);

        if ($requestCount >= $this->maxRequest) {
            http_response_code(429);
            echo json_encode(['message' => 'Demasiadas solicitudes. Intenta más tarde']);
            exit;
        }
    }

    private function getRoutes($method)
    {
        $cacheKey = "routes:{$method}";

        // Intentar obtener rutas desde Redis
        $routes = $this->redis->get($cacheKey);

        if (!$routes) {
            // Si no están cacheadas, cargar las rutas desde el archivo
            $routeFile = __DIR__ . "/../routes/{$method}.php";
            if (file_exists($routeFile)) {
                $routes = include $routeFile;
                // Almacenar las rutas en Redis por 1 hora
                $this->redis->setex($cacheKey, 3600, serialize($routes));  // 3600 segundos = 1 hora
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

    public function route($method, $action, $data)
    {
        $clientIp = $_SERVER['REMOTE_ADDR'];
        $this->checkRateLimit($clientIp);

        $routes = $this->getRoutes($method);

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
