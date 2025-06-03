<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Convocatoria;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class ConvocatoriaController extends BaseController{
    private Convocatoria $convocatoria;
    private TokenService $tokenService;

    public function __construct($convocatoria = null, $tokenService = null)
    {
        parent::__construct();
        $this->convocatoria = $convocatoria ?? new Convocatoria($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Post(
     *     path="/convocatorias",
     *     tags={"Convocatoria"},
     *     summary="Agregar convocatoria",
     *     description="Agrega una nueva convocatoria.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nombreConvocatoria", "descripcion", "requisitos", "salario", "cantidadConvocatoria", "idcargo"},
     *             @OA\Property(property="nombreConvocatoria", type="string", example="Analista de Soporte"),
     *             @OA\Property(property="descripcion", type="string", example="Convocatoria para analista de soporte"),
     *             @OA\Property(property="requisitos", type="string", example="Experiencia en soporte"),
     *             @OA\Property(property="salario", type="string", example="2000000"),
     *             @OA\Property(property="cantidadConvocatoria", type="integer", example=2),
     *             @OA\Property(property="idcargo", type="integer", example=4)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Convocatoria agregada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Convocatoria", type="object")
     *         )
     *     )
     * )
     */
    public function agregarConvocatoria(array $data): void
    {
        $required = [
            'nombreConvocatoria',
            'descripcion',
            'requisitos',
            'salario',
            'cantidadConvocatoria',
            'idcargo'
        ];

        if (!$this->parametrosRequeridos($data, $required)) {
            return; 
        }

        $resultado = $this->convocatoria->agregarConvocatoria($data);
        $this->jsonResponseService->responder(['Convocatoria' => $resultado]);
    }

    /**
     * @OA\Get(
     *     path="/convocatorias",
     *     tags={"Convocatoria"},
     *     summary="Obtener todas las convocatorias",
     *     description="Devuelve la lista de todas las convocatorias registradas.",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de convocatorias",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="convocatorias", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerConvocatorias(): void
    {
        $convocatorias = $this->convocatoria->obtenerConvocatorias();
        $this->jsonResponseService->responder(['convocatorias' => $convocatorias]);
    }

    /**
     * @OA\Get(
     *     path="/convocatorias/detalle",
     *     tags={"Convocatoria"},
     *     summary="Obtener detalle de convocatoria",
     *     description="Obtiene el detalle de una convocatoria por idconvocatoria en query string.",
     *     @OA\Parameter(
     *         name="idconvocatoria",
     *         in="query",
     *         required=true,
     *         description="ID de la convocatoria",
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalle de la convocatoria",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="DetalleConvocatoria"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontró la convocatoria"
     *     )
     * )
     */
    public function obtenerDetalleConvocatoria(): void{
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;

        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError(json_encode(['error' => "No se encontró la convocatoria"]), 400);
            return;
        }

        try {
            $detalleConvocatoria = $this->convocatoria->obtenerDetalleConvocatoria((int)$idconvocatoria);
            if (!$detalleConvocatoria) {
                $this->jsonResponseService->responderError(json_encode([
                    'message' => "No se encontraron detalles para esta convocatoria",
                    'data' => []
                ]), 404);
                return;
            }

            $this->jsonResponseService->responder([
                'message' => 'DetalleConvocatoria',
                'data' => $detalleConvocatoria
            ]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError(json_encode([
                'error' => $e->getMessage()
            ]), $e->getCode() ?: 500);
        }
    }
    /**
     * @OA\Put(
     *     path="/convocatorias/activar",
     *     tags={"Convocatoria"},
     *     summary="Activar convocatoria",
     *     description="Activa una convocatoria por idconvocatoria.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idconvocatoria"},
     *             @OA\Property(property="idconvocatoria", type="integer", example=7)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Convocatoria activada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Convocatoria Activada Correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan datos requeridos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="No se pudo activar la convocatoria"
     *     )
     * )
     */
    public function activarConvocatoria($data): void{
        $required = ['idconvocatoria'];

        if(!this->parametrosRequeridos($data, $required)){
            return;
        }

        $resultado = $this->convocatoria->activarConvocatoria($data['idconvocatoria']);
        if ($resultado){
            $this->jsonResponseService->responder(['success' => true, 'message' => 'Convocatoria Activada Correctamente']);
        } else {
            $this->jsonResponseService->responderError(json_encode(['error' => 'No se pudo activar la convocatoria']), 500);
            return;
        }
    }

    /**
     * @OA\Put(
     *     path="/convocatorias/desactivar",
     *     tags={"Convocatoria"},
     *     summary="Desactivar convocatoria",
     *     description="Desactiva una convocatoria por idconvocatoria.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idconvocatoria"},
     *             @OA\Property(property="idconvocatoria", type="integer", example=7)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Convocatoria desactivada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Convocatoria Desactivada Correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan datos requeridos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="No se pudo desactivar la convocatoria"
     *     )
     * )
     */
    public function desactivarConvocatoria($data): void{
        $required = ['idconvocatoria'];

        if(!this->parametrosRequeridos($data, $required)){
            return;
        }
        $resultado = $this->convocatoria->desactivarConvocatoria($data['idconvocatoria']);
        if ($resultado){
            $this->jsonResponseService->responder(['success' => true, 'message' => 'Convocatoria Desactivada Correctamente']);
        } else {
            $this->jsonResponseService->responderError(json_encode(['error' => 'No se pudo desactivar la convocatoria']), 500);
            return;
        }
    }

}
