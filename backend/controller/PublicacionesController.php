<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Publicaciones;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class PublicacionesController extends BaseController {
    protected Publicaciones $publicaciones;
    protected TokenService $tokenService;

    public function __construct($publicaciones = null, $tokenService = null) {
        parent::__construct();
        $this->publicaciones = $publicaciones ?? new Publicaciones($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
        $this->jsonResponseService = $this->jsonResponseService ?? new \Service\JsonResponseService();
    }

    /**
     * @OA\Get(
     *     path="/publicaciones/tipo-contrato",
     *     tags={"Publicaciones"},
     *     summary="Obtener publicaciones por tipo de contrato",
     *     description="Devuelve las publicaciones asociadas al tipo de contrato del usuario autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="Publicaciones obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Publicaciones", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerPublicacionPorTipoDeContrato() {
        $num_doc = (int) $this->tokenService->validarToken();
        $publicaciones = $this->publicaciones->obtenerPublicacionPorTipoDeContrato($num_doc);
        $this->jsonResponseService->responder(['Publicaciones' => $publicaciones]);
    }

    /**
     * @OA\Post(
     *     path="/publicaciones",
     *     tags={"Publicaciones"},
     *     summary="Agregar publicación",
     *     description="Agrega una nueva publicación para el usuario autenticado (token).",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"titulo", "contenido"},
     *             @OA\Property(property="titulo", type="string", example="Nueva publicación"),
     *             @OA\Property(property="contenido", type="string", example="Contenido de la publicación.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Publicación agregada exitosamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="mensaje", type="string", example="Publicación agregada exitosamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Datos inválidos o faltantes"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al agregar la publicación"
     *     )
     * )
     */

    public function agregarPublicacion($data) {
        $num_doc = (int) $this->tokenService->validarToken();

        if ($data === null && !empty($_POST)) {
            $data = $_POST;
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../uploads/imgPublicaciones/';
                $fileName = uniqid() . '_' . basename($_FILES['imagen']['name']);
                $filePath = $uploadDir . $fileName;
                move_uploaded_file($_FILES['imagen']['tmp_name'], $filePath);
                $data['imagen'] = '/uploads/imgPublicaciones/' . $fileName;
            } else {
                $data['imagen'] = '';
            }
        }

        if ($this->publicaciones->agregarPublicacion($data, $num_doc)) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación agregada exitosamente'], 201);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al agregar la publicación'], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/publicaciones",
     *     tags={"Publicaciones"},
     *     summary="Actualizar publicación",
     *     description="Actualiza una publicación existente para el usuario autenticado (token).",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idPublicacion", "titulo", "contenido"},
     *             @OA\Property(property="idPublicacion", type="integer", example=1),
     *             @OA\Property(property="titulo", type="string", example="Título actualizado"),
     *             @OA\Property(property="contenido", type="string", example="Contenido actualizado.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Publicación actualizada exitosamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="mensaje", type="string", example="Publicación actualizada exitosamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="ID de publicación no proporcionado o datos inválidos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al actualizar la publicación"
     *     )
     * )
     */
    public function actualizarPublicacion($data) {
        $num_doc = (int) $this->tokenService->validarToken();

        if (empty($data['idPublicacion'])) {
            $this->jsonResponseService->responderError(['error' => 'ID de publicación no proporcionado'], 400);
            return; 
        }

        if ($this->publicaciones->actualizarPublicacion($data)) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación actualizada exitosamente'], 200);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al actualizar la publicación'], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/publicaciones",
     *     tags={"Publicaciones"},
     *     summary="Eliminar publicación",
     *     description="Elimina una publicación existente para el usuario autenticado (token).",
     *     @OA\Parameter(
     *         name="idPublicacion",
     *         in="query",
     *         required=true,
     *         description="ID de la publicación a eliminar",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Publicación eliminada exitosamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="mensaje", type="string", example="Publicación eliminada exitosamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="ID de publicación no proporcionado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al eliminar la publicación"
     *     )
     * )
     */
    public function eliminarPublicacion($data) {
        $num_doc = (int) $this->tokenService->validarToken(); 

        if (empty($data['idPublicacion'])) {
            $this->jsonResponseService->responderError(['error' => 'ID de publicación no proporcionado'], 400);
            return; 
        }

        if ($this->publicaciones->eliminarPublicacion($data['idPublicacion'])) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación eliminada exitosamente'], 200);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al eliminar la publicación'], 500);
        }
    }
}
