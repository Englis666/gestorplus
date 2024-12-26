<?php
// MODELOS
require_once 'modelo/chat.php';
require_once 'config/config.php';
//JWT
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class ChatControlador {

    private $db;
    private $chat;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->chat = new Chat($this->db);
    }

    public function enviarMensajes($data) {
       
        $authHeader = apache_request_headers()['Authorization'] ?? null;   
        if (!$authHeader) {
            echo json_encode(['status' => 'error', 'message' => 'Token no proporcionado']);
            http_response_code(401); 
            return;
        }

        $token = str_replace('Bearer ', '', $authHeader);
    
        try {
            
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;
            
            if (!$num_doc) {
                echo json_encode(['status' => 'error', 'message' => 'No se encontró el número de documento en el token']);
                http_response_code(400); 
                return;
            }
    
            $message = $data['message'];
    
            $resultado = $this->chat->enviarMensajes($message, $num_doc);
    
            if ($resultado) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Mensaje enviado correctamente',
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al enviar el mensaje']);
                http_response_code(500); 
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Token expirado']);
            http_response_code(401);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Token con firma inválida']);
            http_response_code(401);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
            http_response_code(500);
        }
    }
    

    public function obtenerMensajes(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;

        if(!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }
        $token = str_replace('Bearer ', '', $authHeader);

        try{
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;

            if(!$num_doc){
                echo json_encode(['error' => 'No se encontro el numero de documento en el token']);
                http_response_code(400);
                return;
            }

            $this->chat = new Chat($this->db);
            $resultado = $this->chat->obtenerMensajes($num_doc);
            if($resultado){
                echo json_encode(['status' => 'success', 'mensajes' => $mensajes]);
            }else{
                echo json_encode(['status' => 'Error', 'mensajes' => 'error']);
            }
            } catch (\Firebase\JWT\ExpiredException $e) {
                echo json_encode(['error' => 'Token expirado']);
                http_response_code(401);
            } catch (\Firebase\JWT\SignatureInvalidException $e) {
                echo json_encode(['error' => 'Token con firma inválida']);
                http_response_code(401);
            } catch (Exception $e) {
                echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
                http_response_code(500);
            }
        }
    }

?>
