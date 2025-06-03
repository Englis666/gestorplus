<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Jornada;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class JornadaController extends BaseController {
    protected Jornada $jornada;
    protected TokenService $tokenService;

    public function __construct($jornada = null, $tokenService = null) {
        parent::__construct();
        $this->jornada = $jornada ?? new Jornada($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/jornadas/todas",
     *     tags={"Jornada"},
     *     summary="Obtener todas las jornadas",
     *     description="Devuelve todas las jornadas registradas en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Jornadas obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Jornadas", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerTodasLasJornadas(): void {
        $jornadas = $this->jornada->obtenerTodasLasJornadas();
        $this->jsonResponseService->responder(['Jornadas' => $jornadas]);
    }

    /**
     * @OA\Get(
     *     path="/jornadas",
     *     tags={"Jornada"},
     *     summary="Obtener jornadas del usuario autenticado",
     *     description="Devuelve las jornadas del usuario autenticado usando el token JWT.",
     *     @OA\Response(
     *         response=200,
     *         description="Jornadas obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Jornadas", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerJornadas(): void {
        $num_doc = $this->tokenService->validarToken();
        $jornadas = $this->jornada->obtenerJornadas($num_doc);
        $this->jsonResponseService->responder(['Jornadas' => $jornadas]);
    }

    /**
     * @OA\Patch(
     *     path="/jornadas/corroborar",
     *     tags={"Jornada"},
     *     summary="Corroborar jornada",
     *     description="Corrobora una jornada por idJornada.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idJornada"},
     *             @OA\Property(property="idJornada", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Jornada corroborada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="JornadaCorroborada", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     )
     * )
     */
    public function corroborarJornada(array $data): void {
        if (!$this->parametrosRequeridos($data, ['idJornada'])) {
            return;
        }
        $resultado = $this->jornada->corroborarJornada($data['idJornada']);
        $this->jsonResponseService->responder(['JornadaCorroborada' => $resultado]);
    }

    /**
     * @OA\Patch(
     *     path="/jornadas/no-corroborar",
     *     tags={"Jornada"},
     *     summary="No corroborar jornada",
     *     description="Marca una jornada como no corroborada por idJornada.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idJornada"},
     *             @OA\Property(property="idJornada", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Jornada no corroborada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="JornadaNoCorroborada", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     )
     * )
     */
    public function noCorroborarJornada(array $data): void {
        if (!$this->parametrosRequeridos($data, ['idJornada'])) {
            return;
        }
        $resultado = $this->jornada->noCorroborarJornada($data['idJornada']);
        $this->jsonResponseService->responder(['JornadaNoCorroborada' => $resultado]);
    }

    /**
     * @OA\Patch(
     *     path="/jornadas/finalizar",
     *     tags={"Jornada"},
     *     summary="Finalizar jornada",
     *     description="Finaliza una jornada por fechaBogota (en el body) y usuario autenticado (token).",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"fechaBogota"},
     *             @OA\Property(property="fechaBogota", type="string", example="2024-06-01")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Jornada finalizada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="JornadaFinalizada", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al finalizar la jornada"
     *     )
     * )
     */
    public function finalizarJornada(array $data): void {
        try {
            $num_doc = $this->tokenService->validarToken();

            if (!$this->parametrosRequeridos($data['data'], ['fechaBogota'])) {
                $this->jsonResponseService->responderError("Faltan parámetros requeridos.");
                return;
            }
            

            $fecha = $data['data']['fechaBogota'];
            $resultado = $this->jornada->finalizarJornada($fecha, (int)$num_doc);

            $this->jsonResponseService->responder(['JornadaFinalizada' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError("Error: " . $e->getMessage());
        }
    }
}


