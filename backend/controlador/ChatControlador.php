<?php
namespace Controlador;

use Config\DataBase;
use Config\Clave;
use Modelo\Chat;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class ChatControlador {
    private $db;
    private $chat;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->chat = new Chat($this->db);
    }

    private function obtenerNumDocDesdeToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? null;

        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Token no proporcionado']);
            exit;
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
            return $decoded->data->num_doc ?? null;
        } catch (\Firebase\JWT\ExpiredException $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Token expirado']);
            exit;
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Token con firma inválida']);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
            exit;
        }
    }


   public function enviarMensaje($data) {
    if (!isset($data['token'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Token no proporcionado']);
        exit;
    }

    $token = $data['token'];

    try {
        $decoded = JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
        $num_doc_emisor = $decoded->data->num_doc ?? null;
    } catch (\Firebase\JWT\ExpiredException $e) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Token expirado']);
        exit;
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Token con firma inválida']);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
        exit;
    }

    $idChat = $data['idChat'] ?? null;
    $mensaje = $data['mensaje'] ?? null;

    if (!$idChat || !$mensaje) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
        exit;
    }

    if ($this->chat->enviarMensaje($idChat, $num_doc_emisor, $mensaje)) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Mensaje enviado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error al enviar el mensaje']);
    }
    exit;
}



    public function obtenerIdChat() {
        $num_doc = $this->obtenerNumDocDesdeToken();

        if (!$num_doc) {
            return;
        }

        $idChat = $this->chat->obtenerIdChat($num_doc);

        if ($idChat) {
            echo json_encode(['idChat' => $idChat]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se encontró el idChat para el usuario']);
        }
    }

    public function obtenerOcrearChat($data){
        $num_doc_emisor = $data['num_doc_emisor'] ?? null;
        $num_doc_receptor = $data['num_doc_receptor'] ?? null;

        if (!$num_doc_receptor || !$num_doc_emisor){
            http_response_code(400);
            echo json_encode(['status' => 'Error' , 'message' => 'num docs no proporcionado']);
            return;
        }
        
        $idChat = $this->chat->obtenerOcrearChat($num_doc_emisor, $num_doc_receptor);

        if ($idChat === null) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error al obtener o crear el chat']);
            return;
        }
        
        echo json_encode(['status' => 'success', 'idChat' => $idChat]);
    }

    public function obtenerMensajes($data){

    $token = $data['token'];

    $token = $data['token'] ?? null;
if (!$token || !validateJWT($token)) {
    $server->push($frame->fd, json_encode([
        'status' => 'error',
        'message' => 'Token inválido o expirado.'
    ]));
    return;
}

    try {
        $decoded = JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
    } catch (\Exception $e) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Token inválido: ' . $e->getMessage()]);
        exit;
    }

    $idChat = $data['idChat'] ?? null;


    $mensajes = $this->chat->obtenerMensajes($idChat);

    if ($mensajes !== false) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'mensajes' => $mensajes]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error al obtener los mensajes']);
    }
    exit;
}

}
