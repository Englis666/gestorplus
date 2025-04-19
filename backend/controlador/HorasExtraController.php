<?php
namespace Controlador;
use Modelo\HorasExtra;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class HorasExtraController{
    private HorasExtra $horasExtra;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->horasExtra = new HorasExtra($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
    }

    public function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
    }
    public function verificarDatosRequeridos(array $data, array $camposRequeridos){
        foreach ($camposRequeridos as $campo){
            if (!isset($data[$campo])){
                $this->responder(['error' => "Falta el campo requerido: $campo"], 400);
                return false;
            }
        }
    return false;
    }

    public function obtenerTodasLasHorasExtra()
    {
        $this->responder($this->horasExtra->obtenerTodasLasHorasExtra());
    }

    public function consultarHorasExtra(){
        $decoded = $this->verificarToken();
        $resultado = $this->usuario->consultarhorasExtra($decoded->data->num_doc);
        $this->jsonResponse($resultado ? 'success' : 'error' , $resultado ? 'Horas extra consultadas' : 'No se pudo consultar las horas extra');
    }



}