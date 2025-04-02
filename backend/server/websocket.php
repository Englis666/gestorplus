<?php

$server = new Swoole\WebSocket\Server("0.0.0.0", 8082);

$server->on("start", function ($server) {
    echo "Servidor WebSocket iniciado en ws://localhost:8082\n";
});

$server->on("open", function ($server, $request) {
    echo "Nueva conexión: {$request->fd}\n";
});

$server->on("message", function ($server, $frame) {
    echo "Mensaje recibido: {$frame->data}\n";

    $data = json_decode($frame->data, true);

    if (!isset($data["action"])) {
        return;
    }

    // Empieza la peticion por medio de Curl en el backend
    $ch = curl_init("http://localhost/gestorplus/backend/");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

    $response = curl_exec($ch);
    //Se cierra la peticion
    curl_close($ch);

    // Enviar la respuesta a todos los clientes conectados
    foreach ($server->connections as $fd) {
        if ($server->isEstablished($fd)) {
            $server->push($fd, $response);
        }
    }
});

$server->on("close", function ($server, $fd) {
    echo "Conexión cerrada: {$fd}\n";
});

$server->start();
