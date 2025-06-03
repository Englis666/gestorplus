<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
namespace Controller;

use Core\Controllers\BaseController;
use Model\Chat;
use Service\TokenService;
use Exception;

class ChatController extends BaseController {
    private Chat $chat;
    private TokenService $tokenService;

    public function __construct($chat = null, $tokenService = null) {
        parent::__construct();
        $this->chat = $chat ?? new Chat($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Post(
     *     path="/chat/mensaje",
     *     tags={"Chat"},
     *     summary="Enviar mensaje",
     *     description="Envía un mensaje en un chat existente.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idChat", "mensaje"},
     *             @OA\Property(property="idChat", type="integer", example=1),
     *             @OA\Property(property="mensaje", type="string", example="Hola, ¿cómo estás?")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Mensaje enviado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Mensaje enviado correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al guardar el mensaje"
     *     )
     * )
     */
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
    

    /**
     * @OA\Get(
     *     path="/chat/id",
     *     tags={"Chat"},
     *     summary="Obtener idChat del usuario autenticado",
     *     description="Obtiene el idChat asociado al usuario autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="idChat encontrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="idChat", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontró el idChat para el usuario"
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/chat/obtener-o-crear",
     *     tags={"Chat"},
     *     summary="Obtener o crear chat",
     *     description="Obtiene el idChat entre dos usuarios o lo crea si no existe.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"num_doc_emisor", "num_doc_receptor"},
     *             @OA\Property(property="num_doc_emisor", type="integer", example=1014736),
     *             @OA\Property(property="num_doc_receptor", type="integer", example=1014737)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="idChat obtenido o creado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="idChat", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="num_doc_emisor y num_doc_receptor son requeridos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener o crear el chat"
     *     )
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/chat/mensajes",
     *     tags={"Chat"},
     *     summary="Obtener mensajes de un chat",
     *     description="Obtiene los mensajes de un chat por idChat (query param).",
     *     @OA\Parameter(
     *         name="idChat",
     *         in="query",
     *         required=true,
     *         description="ID del chat",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Mensajes obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="mensajes", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="idChat es requerido"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido o no proporcionado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener los mensajes"
     *     )
     * )
     */
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
