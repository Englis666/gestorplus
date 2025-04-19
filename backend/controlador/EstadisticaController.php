<?php
namespace Controlador;

use Modelo\Estadistica;
use Servicio\JsonResponseService;
use Servicio\TokenService;

 class EstadisticaController{

    private Estadistica $estadistica;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->estadistica = new Estadistica($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
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

    public function obtenerTotalEstadisticas()
{
    $payload = $this->tokenService->obtenerPayload();

    if (!$payload || !isset($payload->data->num_doc)) {
        $this->responder(['error' => 'Token inválido o faltan datos'], 401);
        return;
    }

    $num_doc = $payload->data->num_doc;
    $rol = $payload->data->rol ?? null;

    $estadisticas = $this->estadistica->obtenerTotalEstadisticas($num_doc, $rol);

    $this->responder([
        'totalJornadas' => $estadisticas['totalJornadas'],
        'totalGenerales' => $estadisticas['totalGenerales'],
        'totalActualizaciones' => $estadisticas['totalActualizaciones']
    ]);
}

    



 }  