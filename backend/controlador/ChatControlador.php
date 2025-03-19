<?php
namespace Controlador;

use Config\DataBase;
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
            $decoded = JWT::decode($token, new Key(SECRET_KEY, JWT_ALGO));
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

    public function iniciarChat($data){
        $num_doc = $this->obtenerNumDocDesdeToken();
        
        if (!$num_doc) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'No se encontró el número de documento']);
            return;
        }

        $targetNum_doc = $data['targetNum_doc'] ?? null;

        if (!$targetNum_doc) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Número de documento del receptor no proporcionado']);
            return;
        }

        $resultado = $this->chat->iniciarChat($targetNum_doc, $num_doc);
        
        if ($resultado) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Chat iniciado correctamente',
                'idChat' => $resultado
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error al iniciar el chat']);
        }
    }

    public function enviarMensajes($data) {
        $num_doc = $this->obtenerNumDocDesdeToken();

        if (!$num_doc) {
            return;
        }

        if (empty($data['message']) || empty($data['idChat'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Datos inválidos']);
            return;
        }

        $message = trim($data['message']);
        $idChat = $data['idChat'];

        $resultado = $this->chat->enviarMensajes($message, $idChat);

        if ($resultado) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Mensaje enviado correctamente'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error al enviar el mensaje']);
        }
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

    public function obtenerMensajes($data) {
        $num_doc = $this->obtenerNumDocDesdeToken();

        if (!$num_doc) {
            return;
        }

        $idChat = $data['idChat'] ?? null;

        if (!$idChat) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID de chat no proporcionado']);
            return;
        }

        $resultado = $this->chat->obtenerMensajes($idChat);

        echo json_encode(['status' => 'success', 'mensajes' => $resultado ?: []]);
    }
}
