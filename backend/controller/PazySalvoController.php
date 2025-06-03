<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\PazySalvo;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class PazySalvoController extends BaseController
{
    private PazySalvo $pazysalvo;
    private TokenService $tokenService;

    public function __construct($pazysalvo = null, $tokenService = null)
    {
        parent::__construct();
        $this->pazysalvo = $pazysalvo ?? new PazySalvo($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/pazysalvo/todos",
     *     tags={"PazySalvo"},
     *     summary="Obtener todos los Paz y Salvo",
     *     description="Devuelve todos los Paz y Salvo registrados en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Paz y Salvo obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Salvos", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener Paz y Salvos"
     *     )
     * )
     */
    public function obtenerPazYSalvos(): void
    {
        try {
            $salvos = $this->pazysalvo->obtenerPazYSalvos();
            $this->jsonResponseService->responder(['Salvos' => $salvos]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => 'Error al obtener Paz y Salvos'], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/pazysalvo/mio",
     *     tags={"PazySalvo"},
     *     summary="Obtener mi Paz y Salvo",
     *     description="Devuelve el Paz y Salvo del usuario autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="Paz y Salvo obtenido",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Salvos", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener el Paz y Salvo"
     *     )
     * )
     */
    public function obtenerMipazYSalvo(): void
    {
        try {
            $num_doc = $this->tokenService->validarToken();
            $salvos = $this->pazysalvo->obtenerMipazYSalvo($num_doc);
            $this->jsonResponseService->responder(['Salvos' => $salvos]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => 'Error al obtener el Paz y Salvo'], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/pazysalvo/generar",
     *     tags={"PazySalvo"},
     *     summary="Generar Paz y Salvo",
     *     description="Genera un nuevo Paz y Salvo para un empleado.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"motivo", "fechaEmision", "estado", "empleado"},
     *             @OA\Property(property="motivo", type="string", example="Finalización de contrato"),
     *             @OA\Property(property="fechaEmision", type="string", example="2024-06-01"),
     *             @OA\Property(property="estado", type="string", example="Emitido"),
     *             @OA\Property(property="empleado", type="integer", example=1014736)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Paz y Salvo generado exitosamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="mensaje", type="string", example="Paz y Salvo generado exitosamente"),
     *             @OA\Property(property="success", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Empleado no especificado correctamente en los datos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al generar el Paz y Salvo"
     *     )
     * )
     */
    public function generarPazYSalvo(array $data): void
    {
        try {
            if (isset($data['empleado'])) {
                $motivo = $data['motivo'];
                $fechaEmision = $data['fechaEmision'];
                $estado = $data['estado'];
                $empleado = $data['empleado']; 
    
                $this->pazysalvo->crearPazYSalvo([
                    'motivo' => $motivo,
                    'fechaEmision' => $fechaEmision,
                    'estado' => $estado,
                    'empleado' => ['num_doc' => $empleado] // Aseguramos que pase como array
                ]);

                $this->jsonResponseService->responder(['mensaje' => 'Paz y Salvo generado exitosamente', 'success' => true]);
            } else {
                throw new Exception('Empleado no especificado correctamente en los datos');
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }
    


}
