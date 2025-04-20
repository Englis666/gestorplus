<?php
namespace Controlador;

use Modelo\Notificacion;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class NotificacionController{

    private Notificacion $notificacion;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->notificacion = new Notificacion($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
    }

    protected function validarToken(): ?string
    {
        try {
            return $this->tokenService->validarToken();
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => $e->getMessage()], $e->getCode());
            return null;
        }
    }
    protected function verificarToken(): void
    {
        if ($this->validarToken() === null) {
            exit;
        }
    }

    private function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data,$httpCode);
    }

    private function verificarDatosRequeridos(array $data, array $camposRequeridos): bool
    {
        foreach ($camposRequeridos as $campo) {
            if (!isset($data[$campo])) {
                $this->responder(['error' => "Falta el campo requerido: $campo"], 400);
                return false;
            }
        }
        return true;
    }

    public function obtenerNotificaciones(): void {
        $decoded = $this->verificarToken();
        $this->responder(['Notificaciones', $this->notificacion->obtenerNotificaciones($decoded->data->num_doc)]);
    }
    public function obtenerTodasLasNotificaciones(){
        $this->verificarToken();
        $this->responder(['Notificaciones' => $this->notificacion->obtenerTodasLasNotificaciones()]);
    }

    public function obtenerNotificacionesAspirante() {
        $num_doc = $this->obtenerNumDocDesdeToken();
        if ($num_doc === null) return;
        try {
            $notificaciones = $this->notificacion->obtenerNotificacionesAspirante($num_doc);
            if (!$notificaciones) {
                $this->responder(['message' => 'No hay notificaciones', 'data' => []], 404);
                return;
            }
            $this->responder(['message' => 'Notificaciones', 'data' => $notificaciones]);
        } catch (Exception $e) {
            $this->responder(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function notificacionAceptada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idausencia']])) {
            return;
        }
        $resultado = $this->notificacion->notificacionAceptada($data['data']['idausencia']);
        $this->responder(['Ausencia' => $resultado]);
    }



    public function notificacionRechazada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idausencia']])) {
            return;
        }
        $resultado = $this->notificacion->notificacionRechazada($data['data']['idausencia']);
        $this->responder(['success' => true, 'AusenciaRechaza' => $resultado]);
    }



    

}