<?php
namespace Controller;

use Core\Controllers\BaseController;
use Model\Chat;
use Service\TokenService;
use Exception;

class ChatController extends BaseController {
    private Chat $chat;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->chat = new Chat($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function enviarMensaje($data) {
        $num_doc_emisor = (int) $this->tokenService->validarToken();
    
        // Validar parámetros requeridos
        if (!$this->parametrosRequeridos($data, ['idChat', 'mensaje'])) {
            return $this->jsonResponseService->responderError('Faltan parámetros requeridos', 400);
        }
    
        $idChat = $data['idChat'];
        $mensaje = $data['mensaje'];
    
        try {
            $mensajeEnviado = $this->chat->enviarMensaje($idChat, $num_doc_emisor, $mensaje);
    
            if ($mensajeEnviado) {
                return $this->jsonResponseService->responder([
                    'status' => 'success',
                    'message' => 'Mensaje enviado correctamente'
                ]);
            } else {
                return $this->jsonResponseService->responderError(
                    'No se pudo guardar el mensaje en la base de datos. Por favor, intente más tarde.',
                    500
                );
            }
        } catch (PDOException $e) {
            return $this->jsonResponseService->responderError(
                'Ocurrió un error en la base de datos. Por favor, intente más tarde.',
                500
            );
        } catch (Exception $e) {
            // Capturar otros errores genéricos y retornarlos
            return $this->jsonResponseService->responderError(
                'Error al procesar el mensaje: ' . $e->getMessage(),
                500
            );
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
