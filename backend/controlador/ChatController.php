<?php
namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Chat;
use Servicio\TokenService;
use PDO;
use Exception;

class ChatController extends BaseController {
    private PDO $db;
    private Chat $chat;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();    
        $this->chat = new Chat($this->db);
        $this->tokenService = new TokenService();
    }

    public function enviarMensaje($data) {
        $num_doc_emisor = $this->tokenService->validarToken();

        if (!$this->parametrosRequeridos($data, ['idChat', 'mensaje'])) {
            return $this->jsonResponseService->responderError('Faltan parámetros requeridos', 400);
        }

        $idChat = $data['idChat'];
        $mensaje = $data['mensaje'];

        if ($this->chat->enviarMensaje($idChat, $num_doc_emisor, $mensaje)) {
            return $this->jsonResponseService->responder([
                'status' => 'success',
                'message' => 'Mensaje enviado correctamente'
            ]);
        } else {
            return $this->jsonResponseService->responderError('Error al enviar el mensaje', 500);
        }
    }

    public function obtenerIdChat() {
        $num_doc = $this->tokenService->validarToken();
        if (!$num_doc) {
            return $this->jsonResponseService->responderError('Token inválido', 401);
        }

        $idChat = $this->chat->obtenerIdChat($num_doc);
        if ($idChat) {
            return $this->jsonResponseService->responder([
                'status' => 'success',
                'idChat' => $idChat
            ]);
        } else {
            return $this->jsonResponseService->responderError('No se encontró el idChat para el usuario', 404);
        }
    }

    public function obtenerOcrearChat($data){
        $num_doc_emisor = $data['num_doc_emisor'] ?? null;
        $num_doc_receptor = $data['num_doc_receptor'] ?? null;

        if (!$num_doc_receptor || !$num_doc_emisor){
            return $this->jsonResponseService->responderError('num_doc_emisor y num_doc_receptor son requeridos', 400);
        }

        $idChat = $this->chat->obtenerOcrearChat($num_doc_emisor, $num_doc_receptor);

        if ($idChat === null) {
            return $this->jsonResponseService->responderError('Error al obtener o crear el chat', 500);
        }

        return $this->jsonResponseService->responder([
            'status' => 'success',
            'idChat' => $idChat
        ]);
    }

    public function obtenerMensajes($data = []) {
        $num_doc = $this->tokenService->validarToken();
        if (!$num_doc) {
            return $this->jsonResponseService->responderError('Token inválido o no proporcionado', 401);
        }

        $idChat = $_GET['idChat'] ?? ($data['idChat'] ?? null);
        if (!$idChat) {
            return $this->jsonResponseService->responderError('idChat es requerido', 400);
        }

        $mensajes = $this->chat->obtenerMensajes($idChat);
        if (is_array($mensajes)) {
            return $this->jsonResponseService->responder([
                'status' => 'success',
                'mensajes' => $mensajes
            ]);
        } else {
            return $this->jsonResponseService->responderError('Error al obtener los mensajes', 500);
        }
    }
}
