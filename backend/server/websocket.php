<?php
require_once __DIR__ . '/../config/Database.php'; 
use Config\Database; 

$db = new DataBase(); // Crear instancia correctamente
$conexion = $db->getConnection(); // Obtener conexión

// WebSocket server
$server = new Swoole\WebSocket\Server("0.0.0.0", 8082);

$server->on("start", function ($server) {
    echo "Servidor WebSocket iniciado en ws://localhost:8082\n";
});

$server->on("open", function ($server, $request) {
    echo "Conexión abierta: {$request->fd}\n";
});

$server->on("message", function ($server, $frame) use ($conexion) {
    echo "Mensaje recibido: {$frame->data}\n";
    $data = json_decode($frame->data, true);

    if (!isset($data['idChat'], $data['message'])) {
        echo "Datos inválidos.\n";
        return;
    }

    $idChat = $data['idChat'];
    $message = $data['message'];

    // Guardar el mensaje en la base de datos
    $stmt = $conexion->prepare("INSERT INTO mensajes (idChat, mensaje) VALUES (?, ?)");
    if ($stmt) {
        $stmt->bind_param("is", $idChat, $message);
        $stmt->execute();
        $stmt->close();
    }

    // Enviar el mensaje a todos los clientes conectados
    foreach ($server->connections as $fd) {
        $server->push($fd, json_encode($data));
    }
});

$server->on("close", function ($server, $fd) {
    echo "Conexión cerrada: {$fd}\n";
});

$server->start();
