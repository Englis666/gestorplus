<?php

$server = new Swoole\WebSocket\Server("0.0.0.0", 8082);

// Evento cuando el servidor se inicia
$server->on("start", function ($server) {
    echo "✅ Servidor WebSocket iniciado en ws://localhost:8082\n";
});

// Evento cuando un cliente se conecta
$server->on("open", function ($server, $request) {
    echo "🔌 Nueva conexión: {$request->fd}\n";
});

// Evento cuando se recibe un mensaje
$server->on("message", function ($server, $frame) {
    echo "📨 Mensaje recibido de {$frame->fd}: {$frame->data}\n";

    $data = json_decode($frame->data, true);

    if (!isset($data["action"])) {
        $server->push($frame->fd, json_encode([
            'status' => 'error',
            'message' => 'No se recibió la acción.'
        ]));
        return;
    }

    $ch = curl_init("http://localhost/gestorplus/backend/");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

    $response = curl_exec($ch);

    if ($response === false) {
        $error = curl_error($ch);
        echo "❌ Error en la solicitud cURL: $error\n";
        $server->push($frame->fd, json_encode([
            'status' => 'error',
            'message' => 'Error al hacer la solicitud al backend: ' . $error
        ]));
    } else {
        foreach ($server->connections as $fd) {
            if ($server->isEstablished($fd)) {
                $server->push($fd, $response);
            }
        }
    }

    curl_close($ch);
});

// Evento cuando un cliente se desconecta
$server->on("close", function ($server, $fd) {
    echo "❎ Conexión cerrada: {$fd}\n";
});

$server->start();
