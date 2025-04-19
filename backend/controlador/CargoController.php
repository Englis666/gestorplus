<?php
namespace Controlador;

use Modelo\Cargo;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class CargoController {
    private Cargo $cargo;
    private ?\PDO $db; 
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->cargo = new Cargo($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new JsonResponseService();
    }

    public function responder(array $data ,int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode); 
    }

    public function verificarDatosRequeridos(array $data, array $camposRequeridos): bool{
        foreach ($camposRequeridos as $campo){
            if (!isset($data[$campo])){
                $this->responder(['error' => "Falta el campo requerido : $campo"], 400);
                return false;
            }
        }
        return true;
    }

    public function obtenerCargos(){
        $this->responder(['cargos' => $this->cargo->obtenerCargos()]);
    }

    public function agregarCargo(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['nombreCargo'])) {
            return;
        }
        $resultado = $this->cargo->agregarCargo($data['nombreCargo']);
        $this->responder(['success' => true, 'cargo' => $resultado]);
    }

}