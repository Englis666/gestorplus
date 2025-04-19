<?php
namespace Controlador;
use Modelo\PazySalvo;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class PazySalvoController{
    private PazySalvo $pazysalvo;
    private ?\PDO $db; 
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->pazysalvo = new PazySalvo($this->db);
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

    public function obtenerPazYSalvos()
    {
        $this->responder(['Salvos' => $this->pazysalvo->obtenerPazYSalvos()]);
    }

    public function obtenerMipazYSalvo(): void{
        $num_doc = $this->validarToken();
        $this->responder('Salvos', $this->empleado->obtenerMipazYSalvo($num_doc));
    }

}