<?php
declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Notificacion;
use Servicio\TokenService;
use PDO;
use Exception;

class NotificacionController extends BaseController{
    
    private PDO $db;
    private Notificacion $notificacion;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->notificacion = new Notificacion($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerNotificaciones(): void {
        $num_doc = $this->tokenService->validarToken();
        $this->jsonResponseService->responder(['Notificaciones' => $this->notificacion->obtenerNotificaciones($num_doc)]);
    }

    public function obtenerTodasLasNotificaciones(){
        $this->jsonResponseService->responder(['Notificaciones' => $this->notificacion->obtenerTodasLasNotificaciones()]);
    }

    public function obtenerNotificacionesAspirante() {
        $num_doc = $this->tokenService->validarToken();
        if ($num_doc === null) return;
        try {
            $notificaciones = $this->notificacion->obtenerNotificacionesAspirante($num_doc);
            if (!$notificaciones) {
                $this->jsonResponseService->responderError('No hay notificaciones', 404);
                return;
            }
            $this->jsonResponseService->responder(['message' => 'Notificaciones', 'data' => $notificaciones]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function notificacionAceptada(array $data) {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idausencia']])) {
            return;
        }
        $resultado = $this->notificacion->notificacionAceptada($data['data']['idausencia']);
        $this->jsonResponseService->responder(['Ausencia' => $resultado]);
    }

    public function notificacionRechazada(array $data) {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idausencia']])) {
            return;
        }
        $resultado = $this->notificacion->notificacionRechazada($data['data']['idausencia']);
        $this->jsonResponseService->responder(['success' => true, 'AusenciaRechaza' => $resultado]);
    }
}
