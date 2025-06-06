<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;
use Core\Controllers\BaseController;
use Model\Estadistica;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

 class EstadisticaController extends BaseController{
    protected Estadistica $estadistica;
    protected TokenService $tokenService;

    public function __construct($estadistica = null, $tokenService = null){
        parent::__construct();
        $this->estadistica = $estadistica ?? new Estadistica($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/estadisticas/total",
     *     tags={"Estadistica"},
     *     summary="Obtener totales de estadísticas",
     *     description="Obtiene el total de jornadas, generales y actualizaciones para el usuario autenticado (requiere token JWT).",
     *     @OA\Response(
     *         response=200,
     *         description="Totales obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="totalJornadas", type="integer", example=10),
     *             @OA\Property(property="totalGenerales", type="integer", example=5),
     *             @OA\Property(property="totalActualizaciones", type="integer", example=3)
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido o faltan datos"
     *     )
     * )
     */
    public function obtenerTotalEstadisticas(){
    $payload = $this->tokenService->obtenerPayload();

    if (!$payload || !isset($payload->data->num_doc)) {
        $this->jsonResponseService->responder(['error' => 'Token inválido o faltan datos'], 401);
        return;
    }

    $num_doc = $payload->data->num_doc;
    $rol = $payload->data->rol ?? null;

    $estadisticas = $this->estadistica->obtenerTotalEstadisticas($num_doc, $rol);

    $this->jsonResponseService->responder([
        'totalJornadas' => $estadisticas['totalJornadas'],
        'totalGenerales' => $estadisticas['totalGenerales'],
        'totalActualizaciones' => $estadisticas['totalActualizaciones']
    ]);
}

    



 }