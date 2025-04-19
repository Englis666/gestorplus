<?php
namespace Controlador;

use Modelo\Empleado;
use Config\DataBase;
use Servicio\TokenService;
use Servicio\JsonResponseService;

class EmpleadoControlador {
    private $db;
    private Empleado $empleado;
    private TokenService $tokenService;
    private JsonResponseService $jsonResponseService;

    public function __construct() {
        $this->db = (new DataBase())->getConnection();
        $this->empleado = new Empleado($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new JsonResponseService();
    }

    protected function validarToken(): string {
       return $this->tokenService->validarToken();
    }

    private function responder(string $clave, $resultado): void {
        $this->jsonResponseService->responder([$clave => $resultado ?: []]);
    }

    

 

    

    public function solicitarQueja(array $data): void {
        $num_doc = $this->validarToken();
        $this->responder('message', $this->empleado->solicitarQueja($num_doc, $data) ? 'Queja enviada' : 'Error al enviar la queja');
    }
   
  
 
  
}
