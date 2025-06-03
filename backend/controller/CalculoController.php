<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Calculo;
use Service\TokenService;
use Service\JsonResponseService;
use Exception;

class CalculoController extends BaseController {
    protected TokenService $tokenService;
    protected Calculo $calculo;
    protected JsonResponseService $jsonResponseService;

    public function __construct($calculo = null, $tokenService = null) {
        parent::__construct();
        $this->calculo = $calculo ?? new Calculo($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/calculo/postulaciones-convocatorias",
     *     tags={"Calculo"},
     *     summary="Calcular postulaciones en convocatorias",
     *     description="Calcula el número de postulaciones en cada convocatoria.",
     *     @OA\Response(
     *         response=200,
     *         description="Cálculo realizado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="convocatorias", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error en el cálculo"
     *     )
     * )
     */
    public function calcularPostulacionesEnConvocatorias(): void {
        try {
            $resultado = $this->calculo->calcularPostulacionesEnConvocatorias();
            $this->jsonResponseService->responder(['convocatorias' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/calculo/horas-extra",
     *     tags={"Calculo"},
     *     summary="Calcular horas extra",
     *     description="Calcula las horas extra de los empleados.",
     *     @OA\Response(
     *         response=200,
     *         description="Cálculo realizado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="calculo", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error en el cálculo"
     *     )
     * )
     */
    public function calcularHorasExtra(): void {
        try {
            $resultado = $this->calculo->calcularHorasExtra();
            $this->jsonResponseService->responder(['calculo' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/calculo/minutos-trabajados",
     *     tags={"Calculo"},
     *     summary="Obtener minutos trabajados del usuario autenticado",
     *     description="Devuelve los minutos trabajados por el usuario autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="Minutos trabajados obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="minutosTrabajados", type="integer", example=480)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener los minutos trabajados"
     *     )
     * )
     */
    public function obtenerMinutosTrabajados(): void {
        try {
            $num_doc = $this->tokenService->obtenerToken(); 
            $resultado = $this->calculo->obtenerMinutosTrabajados($num_doc);
            $this->jsonResponseService->responder(['minutosTrabajados' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/calculo/minutos-trabajados-empleado",
     *     tags={"Calculo"},
     *     summary="Obtener minutos trabajados de todos los empleados",
     *     description="Devuelve los minutos trabajados de todos los empleados.",
     *     @OA\Response(
     *         response=200,
     *         description="Minutos trabajados obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="minutosTrabajados", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener los minutos trabajados"
     *     )
     * )
     */
    public function obtenerMinutosTrabajadosDelEmpleado(): void {
        try {
            $resultado = $this->calculo->obtenerMinutosTrabajadosDelEmpleado();
            $this->jsonResponseService->responder(['minutosTrabajados' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }
}
