<?php

$server = new Swoole\WebSocket\Server("0.0.0.0", 8082);

$server->on("start", function ($server) {
    echo "✅ Servidor WebSocket iniciado en ws://localhost:8082\n";
});

$server->on("open", function ($server, $request) {
    echo "🔌 Nueva conexión: {$request->fd}\n";
});

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

    $method = isset($data["method"]) ? strtoupper($data["method"]) : "POST";

    $url = "http://localhost/gestorplus/backend/";

    if ($method === "GET") {
        $queryParams = http_build_query(array_filter($data, fn($k) => $k !== 'method' && $k !== 'token', ARRAY_FILTER_USE_KEY));
        $url .= "?" . $queryParams;
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $headers = ["Content-Type: application/json"];

    // ✅ Añadir el token como header Authorization
    if (isset($data["token"])) {
        $headers[] = "Authorization: Bearer " . $data["token"];
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if ($method === "POST") {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);

    if ($response === false) {
        $error = curl_error($ch);
        echo "❌ Error en la solicitud cURL: $error\n";
        $server->push($frame->fd, json_encode([
            'status' => 'error',
            'message' => 'Error al hacer la solicitud al backend: ' . $error
        ]));
    } else {
       foreach ($server->connections as $client) {
    if ($server->isEstablished($client)) {
        $server->push($client, $response); // ⬅️ Enviar a todos
    }
}

    }

    curl_close($ch);
});

$server->on("close", function ($server, $fd) {
    echo "❎ Conexión cerrada: {$fd}\n";
});

$server->start();
