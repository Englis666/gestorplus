<?php
namespace Controlador;
use Modelo\Vinculacion;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class VinculacionController{
    private Vinculacion $vinculacion;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->vinculacion = new Vinculacion($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
    }

    public function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    private function verificarDatosRequeridos(array $data, array $camposRequeridos): bool{
        foreach ($camposRequeridos as $campo){
            if (!isset($data[$campo])){
                $this->responder(['error' => "Falta el campo requerido: $campo"], 400);
                return false;
            }
        }
    return true;
    }

    public function asignarVinculacion(array $data)
    {
        $required = ['num_doc', 'fechaInicio', 'fechaFin', 'tipoContrato', 'salario', 'estadoContrato', 'fechaFirma'];
        if (!$this->verificarDatosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->vinculacion->asignarVinculacion($data);
        $this->responder(['Vinculacion' => $resultado]);
    }

    public function obtenerVinculaciones()
    {
        $this->responder(['Vinculaciones' => $this->vinculacion->obtenerVinculaciones()]);
    }



}