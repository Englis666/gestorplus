<?php 
namespace Controlador;

use Modelo\Ausencia;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class AusenciaController{
    private $db;
    private Ausencia $ausencia;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct()
    {
        $this->db = (new \Config\Database())->getConnection();
        $this->ausencia = new Ausencia($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new JsonResponseService();
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

    public function obtenerTodasLasAusencias()
    {
        $this->responder(['Ausencias' => $this->ausencia->obtenerTodasLasAusencias()]);
    }
    
    public function asistenciaConfirmada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['identrevista'])) {
            return;
        }
        $resultado = $this->ausencia->asistenciaConfirmada($data['identrevista']);
        $this->responder(['Asistencia' => $resultado]);
    }



    public function asistenciaNoConfirmada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['identrevista'])) {
            return;
        }
        $resultado = $this->ausencia->asistenciaNoConfirmada($data['identrevista']);
        $this->responder(['noAsistencia' => $resultado]);
    }

   

}
