<?php

header("Access-Control-Allow-Origin: *");
<<<<<<< HEAD
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-estudio-id, x-experiencia-id");
=======
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE , OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
>>>>>>> 62ffeb108c1433b5f55f2d2f6c641effae580a3f
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';

$endpoint = $_GET['endpoint'] ?? $_POST['endpoint'] ?? null;

if ($endpoint === 'archivos') {
    require_once 'servidor/archivos.php';
} else {
    require_once 'servidor/servidor.php';
}

?>
