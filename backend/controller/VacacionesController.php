<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);
namespace Controller;
use Core\Controllers\BaseController;
use Service\TokenService;
use Model\Vacaciones;

class VacacionesController extends BaseController {
    private Vacaciones $vacaciones;
    private TokenService $tokenService;

    public function __construct($vacaciones = null, $tokenService = null) {
        parent::__construct();
        $this->vacaciones = $vacaciones ?? new Vacaciones($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/vacaciones/todas",
     *     tags={"Vacaciones"},
     *     summary="Obtener todas las vacaciones",
     *     description="Devuelve todas las vacaciones registradas en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Vacaciones obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Vacaciones", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerTodasLasVacaciones(): void {
        $vacaciones = $this->vacaciones->obtenerTodasLasVacaciones();
        $this->jsonResponseService->responder(['Vacaciones' => $vacaciones]);
    }

    /**
     * @OA\Get(
     *     path="/vacaciones/mias",
     *     tags={"Vacaciones"},
     *     summary="Obtener mis vacaciones",
     *     description="Devuelve las vacaciones del usuario autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="Vacaciones encontradas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Vacaciones", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerMisVacaciones(): void {
        $num_doc = (int) $this->tokenService->validarToken();
        $vacaciones = $this->vacaciones->obtenerMisVacaciones($num_doc);
        $this->jsonResponseService->responder(['Vacaciones' => $vacaciones]);
    }

    /**
     * @OA\Post(
     *     path="/vacaciones/solicitar",
     *     tags={"Vacaciones"},
     *     summary="Solicitar vacaciones",
     *     description="Permite al usuario autenticado solicitar vacaciones.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"fechaInicio", "fechaFin"},
     *             @OA\Property(property="fechaInicio", type="string", example="2024-07-01"),
     *             @OA\Property(property="fechaFin", type="string", example="2024-07-15")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Vacaciones solicitadas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Vacaciones solicitadas")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error al solicitar las vacaciones"
     *     )
     * )
     */
    public function solicitarVacaciones(array $data): void {
        $num_doc = (int) $this->tokenService->validarToken();
        $mensaje = $this->vacaciones->solicitarVacaciones($num_doc, $data)
            ? 'Vacaciones solicitadas'
            : 'Error al solicitar las vacaciones';
        $this->jsonResponseService->responder(['message' => $mensaje]);
    }

    /**
     * @OA\Patch(
     *     path="/vacaciones/aceptar",
     *     tags={"Vacaciones"},
     *     summary="Aceptar solicitud de vacaciones",
     *     description="Permite aceptar una solicitud de vacaciones por idvacacion.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idvacacion"},
     *             @OA\Property(property="idvacacion", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Vacación aceptada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="vacacionAceptada", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error al aceptar la vacación"
     *     )
     * )
     */
    public function aceptarVacacion(array $data): void {
        $idvacacion = $data['idvacacion'];
        $vacaciones = $this->vacaciones->aceptarVacacion($idvacacion);
        $this->jsonResponseService->responder(['vacacionAceptada' => $vacaciones]);
    }

    /**
     * @OA\Patch(
     *     path="/vacaciones/rechazar",
     *     tags={"Vacaciones"},
     *     summary="Rechazar solicitud de vacaciones",
     *     description="Permite rechazar una solicitud de vacaciones por idvacacion.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idvacacion"},
     *             @OA\Property(property="idvacacion", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Vacación rechazada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="vacacionRechazada", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error al rechazar la vacación"
     *     )
     * )
     */
    public function rechazarVacacion(array $data): void {
        $idvacacion = $data['idvacacion']; 
        $vacaciones = $this->vacaciones->rechazarVacacion($idvacacion);
        $this->jsonResponseService->responder(['vacacionRechazada' => $vacaciones]);
    }


}
