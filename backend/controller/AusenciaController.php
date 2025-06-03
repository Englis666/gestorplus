<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Ausencia;
use Service\TokenService;
use Exception;

class AusenciaController extends BaseController {
    private Ausencia $ausencia;
    private TokenService $tokenService;

    public function __construct($ausencia = null, $tokenService = null) {
        parent::__construct();
        $this->ausencia = $ausencia ?? new Ausencia($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();  
    }

    /**
     * @OA\Get(
     *     path="/ausencias/todas",
     *     tags={"Ausencia"},
     *     summary="Obtener todas las ausencias",
     *     description="Devuelve todas las ausencias registradas en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Ausencias obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Ausencias", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerTodasLasAusencias(): void {
        $ausencias = $this->ausencia->obtenerTodasLasAusencias();
        $this->jsonResponseService->responder(['Ausencias' => $ausencias]);
    }

    /**
     * @OA\Get(
     *     path="/ausencias",
     *     tags={"Ausencia"},
     *     summary="Obtener ausencias del usuario autenticado",
     *     description="Devuelve las ausencias del usuario autenticado usando el token JWT.",
     *     @OA\Response(
     *         response=200,
     *         description="Ausencias encontradas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Ausencias", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerAusencias(): void {
        try {
            $num_doc = $this->tokenService->validarToken();
            $ausencias = $this->ausencia->obtenerAusencias($num_doc);
            $this->jsonResponseService->responder(['Ausencias' => $ausencias]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    /**
     * @OA\Post(
     *     path="/ausencias/solicitar",
     *     tags={"Ausencia"},
     *     summary="Solicitar ausencia",
     *     description="Permite al usuario autenticado solicitar una ausencia.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"motivo", "fechaInicio", "fechaFin"},
     *             @OA\Property(property="motivo", type="string", example="Enfermedad"),
     *             @OA\Property(property="fechaInicio", type="string", example="2024-07-01"),
     *             @OA\Property(property="fechaFin", type="string", example="2024-07-05")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Solicitud de ausencia registrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="mensaje", type="string", example="Solicitud de ausencia registrada exitosamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error al registrar la ausencia"
     *     )
     * )
     */
    public function solicitarAusencia(array $data): void {
        try {
            $num_doc = $this->tokenService->validarToken();
            $this->ausencia->solicitarAusencia($num_doc, $data);
            $this->jsonResponseService->responder(['mensaje' => 'Solicitud de ausencia registrada exitosamente']);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    /**
     * @OA\Post(
     *     path="/ausencias/aceptar",
     *     tags={"Ausencia"},
     *     summary="Aceptar ausencia",
     *     description="Permite aceptar una ausencia por idausencia.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idausencia"},
     *             @OA\Property(property="idausencia", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Ausencia aceptada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="ID de ausencia no recibido"
     *     )
     * )
     */
    public function ausenciaAceptada($data): void {
        if (isset($data['idausencia'])) {
            $idausencia = $data['idausencia'];
            $resultado = $this->ausencia->ausenciaAceptada($idausencia);
            $this->jsonResponseService->responder(['success' => $resultado]);
        } else {
            $this->jsonResponseService->responderError('ID de ausencia no recibido.');
        }
    }

    /**
     * @OA\Post(
     *     path="/ausencias/rechazar",
     *     tags={"Ausencia"},
     *     summary="Rechazar ausencia",
     *     description="Permite rechazar una ausencia por idausencia.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idausencia"},
     *             @OA\Property(property="idausencia", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Ausencia rechazada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="ID de ausencia no recibido"
     *     )
     * )
     */
    public function ausenciaRechazada($data): void {
        if (isset($data['idausencia'])) {
            $idausencia = $data['idausencia'];
            $resultado = $this->ausencia->ausenciaRechazada($idausencia);
            $this->jsonResponseService->responder(['success' => $resultado]);
        } else {
            $this->jsonResponseService->responderError('ID de ausencia no recibido.');
        }
    }
}
