<?php
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

    public function __construct(){
        parent::__construct();
        $this->notificacion = new Notificacion($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function obtenerNotificaciones(): void {
        $num_doc = (int) $this->tokenService->validarToken();
        $this->jsonResponseService->responder([
            'Notificaciones' => $this->notificacion->obtenerNotificaciones($num_doc)
        ]);
    }

    public function obtenerTodasLasNotificaciones(): void {
        $this->jsonResponseService->responder([
            'Notificaciones' => $this->notificacion->obtenerTodasLasNotificaciones()
        ]);
    }

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
