<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
namespace Controller;

use Core\Controllers\BaseController;
use Model\HorasExtra;
use Service\TokenService;
use Exception;

class HorasExtraController extends BaseController{
    private HorasExtra $horasExtra;
    private TokenService $tokenService;

    public function __construct($horasExtra = null, $tokenService = null) {
        parent::__construct();
        $this->horasExtra = $horasExtra ?? new HorasExtra($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/horasextra/todas",
     *     tags={"HorasExtra"},
     *     summary="Obtener todas las horas extra",
     *     description="Devuelve todas las horas extra registradas en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Horas extra obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="calculo", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerTodasLasHorasExtra()
    {
        $datos = $this->horasExtra->obtenerTodasLasHorasExtra();
        $this->jsonResponseService->responder([
            'status' => 'success',
            'calculo' => $datos
        ]);
    }

    /**
     * @OA\Get(
     *     path="/horasextra/consultar",
     *     tags={"HorasExtra"},
     *     summary="Consultar horas extra del usuario autenticado",
     *     description="Consulta las horas extra del usuario autenticado usando el token JWT.",
     *     @OA\Response(
     *         response=200,
     *         description="Horas extra consultadas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Horas extra consultadas")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="No se pudo consultar las horas extra"
     *     )
     * )
     */
    public function consultarHorasExtra(){
        $decoded = $this->verificarToken();

        $resultado = $this->usuario->consultarhorasExtra($decoded->data->num_doc);
        $this->jsonResponseService->responder($resultado ? 'success' : 'error' , $resultado ? 'Horas extra consultadas' : 'No se pudo consultar las horas extra');
    }


    /**
     * @OA\Post(
     *     path="/horasextra/calcular",
     *     tags={"HorasExtra"},
     *     summary="Calcular horas extra",
     *     description="Calcula las horas extra a partir de los datos enviados en el body.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="frame", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cálculo realizado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error en el cálculo de horas extra"
     *     )
     * )
     */
    public function calcularHorasExtra($frame){
        $response = $this->horasExtraService->calcularHorasExtra($frame);
       return $response;
    }


}