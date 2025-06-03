<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Notificacion;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class NotificacionController extends BaseController {
    private Notificacion $notificacion;
    private TokenService $tokenService;

    public function __construct($notificacion = null, $tokenService = null) {
        parent::__construct();
        $this->notificacion = $notificacion ?? new Notificacion($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/notificaciones",
     *     tags={"Notificacion"},
     *     summary="Obtener notificaciones del usuario autenticado",
     *     description="Devuelve las notificaciones del usuario autenticado usando el token JWT.",
     *     @OA\Response(
     *         response=200,
     *         description="Notificaciones obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Notificaciones", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerNotificaciones(): void {
        $num_doc = (int) $this->tokenService->validarToken();
        $this->jsonResponseService->responder([
            'Notificaciones' => $this->notificacion->obtenerNotificaciones($num_doc)
        ]);
    }

    /**
     * @OA\Get(
     *     path="/notificaciones/todas",
     *     tags={"Notificacion"},
     *     summary="Obtener todas las notificaciones",
     *     description="Devuelve todas las notificaciones del sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Notificaciones obtenidas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Notificaciones", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerTodasLasNotificaciones(): void {
        $this->jsonResponseService->responder([
            'Notificaciones' => $this->notificacion->obtenerTodasLasNotificaciones()
        ]);
    }

    /**
     * @OA\Get(
     *     path="/notificaciones/aspirante",
     *     tags={"Notificacion"},
     *     summary="Obtener notificaciones de aspirante",
     *     description="Devuelve las notificaciones para el usuario aspirante autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="Notificaciones encontradas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Notificaciones"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No hay notificaciones"
     *     )
     * )
     */
    public function obtenerNotificacionesAspirante(): void {
        $num_doc = (int) $this->tokenService->validarToken();

        if (!$num_doc) {
            return;
        }

        try {
            $notificaciones = $this->notificacion->obtenerNotificacionesAspirante($num_doc);

            if (!$notificaciones) {
                $this->jsonResponseService->responderError('No hay notificaciones', 404);
                return;
            }

            $this->jsonResponseService->responder([
                'message' => 'Notificaciones',
                'data'    => $notificaciones
            ]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError(
                $e->getMessage(),
                $e->getCode() ?: 400
            );
        }
    }
}
