<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: * ");

header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
header("Content-Type: application/json; charset=UTF-8");


require_once __DIR__ . '/vendor/autoload.php';
require_once 'servidor/servidor.php';

?>