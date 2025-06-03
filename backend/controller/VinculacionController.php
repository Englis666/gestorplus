<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);
namespace Controller;
use Core\Controllers\BaseController;
use Model\Vinculacion;
use Exception;

class VinculacionController extends BaseController {
    private Vinculacion $vinculacion;

    public function __construct($vinculacion = null) {
        parent::__construct();
        $this->vinculacion = $vinculacion ?? new Vinculacion($this->dbService);
    }

    /**
     * @OA\Post(
     *     path="/vinculaciones/asignar",
     *     tags={"Vinculacion"},
     *     summary="Asignar vinculación",
     *     description="Asigna una nueva vinculación a un usuario.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"num_doc", "fechaInicio", "fechaFin", "tipoContrato", "salario", "estadoContrato", "fechaFirma"},
     *             @OA\Property(property="num_doc", type="integer", example=1014736),
     *             @OA\Property(property="fechaInicio", type="string", example="2025-03-31"),
     *             @OA\Property(property="fechaFin", type="string", example="2025-03-31"),
     *             @OA\Property(property="tipoContrato", type="string", example="Prestacion de Servicios"),
     *             @OA\Property(property="salario", type="string", example="1800000.00"),
     *             @OA\Property(property="estadoContrato", type="string", example="Activo"),
     *             @OA\Property(property="fechaFirma", type="string", example="2025-03-31")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Vinculación asignada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Vinculacion", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Datos requeridos incompletos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al asignar la vinculación"
     *     )
     * )
     */
    public function asignarVinculacion(array $data): void {
        $required = ['num_doc', 'fechaInicio', 'fechaFin', 'tipoContrato', 'salario', 'estadoContrato', 'fechaFirma'];

        try {
            if (!$this->parametrosRequeridos($data, $required)) {
                $this->jsonResponseService->responderError('Datos requeridos incompletos', 422);
                return;
            }

            $resultado = $this->vinculacion->asignarVinculacion($data);
            $this->jsonResponseService->responder(['Vinculacion' => $resultado]);

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/vinculaciones",
     *     tags={"Vinculacion"},
     *     summary="Obtener todas las vinculaciones",
     *     description="Devuelve todas las vinculaciones registradas en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Vinculaciones obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Vinculaciones", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener las vinculaciones"
     *     )
     * )
     */
    public function obtenerVinculaciones(): void {
        try {
            $resultado = $this->vinculacion->obtenerVinculaciones();
            $this->jsonResponseService->responder(['Vinculaciones' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }
}
