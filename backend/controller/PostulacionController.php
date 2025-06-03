<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Postulacion;
use Service\TokenService;
use Exception;

class PostulacionController extends BaseController{
    protected Postulacion $postulacion;
    protected TokenService $tokenService;

    public function __construct($postulacion = null, $tokenService = null) {
        parent::__construct();
        $this->postulacion = $postulacion ?? new Postulacion($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/postulaciones",
     *     tags={"Postulacion"},
     *     summary="Obtener todas las postulaciones",
     *     description="Devuelve todas las postulaciones registradas en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Postulaciones obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Postulaciones", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerPostulaciones() {
        $this->jsonResponseService->responder(['Postulaciones' => $this->postulacion->obtenerPostulaciones()]);
    }

    /**
     * @OA\Get(
     *     path="/postulaciones/convocatorias",
     *     tags={"Postulacion"},
     *     summary="Obtener convocatorias de postulaciones",
     *     description="Devuelve las convocatorias asociadas a postulaciones.",
     *     @OA\Response(
     *         response=200,
     *         description="Convocatorias de postulaciones obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="ConvocatoriaPostulaciones", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerConvocatoriasPostulaciones() {
        $this->jsonResponseService->responder(['ConvocatoriaPostulaciones' => $this->postulacion->obtenerConvocatoriasPostulaciones()]);
    }

    /**
     * @OA\Get(
     *     path="/postulaciones/verificar",
     *     tags={"Postulacion"},
     *     summary="Verificar postulacion",
     *     description="Verifica si el usuario autenticado está postulado a una convocatoria (requiere idconvocatoria en query).",
     *     @OA\Parameter(
     *         name="idconvocatoria",
     *         in="query",
     *         required=true,
     *         description="ID de la convocatoria",
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Postulación verificada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="PostulacionVerificada"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Parámetro idconvocatoria requerido"
     *     )
     * )
     */
    public function verificarPostulacion() {
        $num_doc = $this->tokenService->validarToken();
        if ($num_doc === null) return;

        $idconvocatoria = $_GET['idconvocatoria'] ?? null;
        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError('Parámetro idconvocatoria requerido', 400);
            return;
        }

        try {
            $resultados = $this->postulacion->verificarPostulacion($num_doc, $idconvocatoria);
            $this->jsonResponseService->responder(['status' => 'PostulacionVerificada', 'data' => $resultados]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    /**
     * @OA\Get(
     *     path="/postulaciones/mias",
     *     tags={"Postulacion"},
     *     summary="Obtener postulaciones del aspirante autenticado",
     *     description="Devuelve las postulaciones del usuario autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="Postulaciones encontradas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="MisPostulaciones"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No hay postulaciones"
     *     )
     * )
     */
    public function obtenerPostulacionesAspirante() {
        $num_doc = (int) $this->tokenService->validarToken();
        if ($num_doc === null) return;

        try {
            $postulaciones = $this->postulacion->obtenerPostulacionesAspirante($num_doc);
            if (!$postulaciones) {
                $this->jsonResponseService->responderError('No hay postulaciones', 404);
                return;
            }
            $this->jsonResponseService->responder(['message' => 'MisPostulaciones', 'data' => $postulaciones]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/postulaciones/agrupadas",
     *     tags={"Postulacion"},
     *     summary="Obtener postulaciones agrupadas por convocatoria",
     *     description="Devuelve las postulaciones agrupadas por convocatoria (requiere idconvocatoria en query).",
     *     @OA\Parameter(
     *         name="idconvocatoria",
     *         in="query",
     *         required=true,
     *         description="ID de la convocatoria",
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Postulantes encontrados",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No hay postulantes para esta convocatoria"
     *     )
     * )
     */
    public function obtenerPostulacionesAgrupadasPorConvocatoria() {
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;
        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError('Parámetro idconvocatoria requerido', 400);
            return;
        }
    
        try {
            $postulantes = $this->postulacion->obtenerPostulacionesAgrupadasPorConvocatoria((int)$idconvocatoria);   
            if (empty($postulantes)) {
                $this->jsonResponseService->responderError('No hay postulantes para esta convocatoria', 404);
                return;
            }
            $this->jsonResponseService->responder(['data' => $postulantes]);
    
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

}
