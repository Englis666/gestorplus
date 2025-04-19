<?php 
namespace Controlador;

use Modelo\Certificado;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class CertificadoController{
    private $db;
    private Certificado $certificado;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

   public function __construct()
    {
        $this->db = (new \Config\Database())->getConnection();
        $this->certificado = New certificado($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new JsonResponseService();
    }

    public function responder(array $data, int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
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

    public function obtenerDatosParaCertificado(){
        $decoded = $this->verificarToken();
        $resultado = $this->usuario->obtenerDatosParaCertificado($decoded->data->num_doc);
        $this->jsonResponse('success', '' , ['Certificado' => $resultado ?: []]); 
        
    }


}