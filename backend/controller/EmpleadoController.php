<?php
declare(strict_types = 1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Empleado;
use Service\TokenService;
use PDO;
use Exception;


class EmpleadoController extends BaseController{
    private PDO $db;
    private Empleado $empleado;
    private TokenService $tokenService;
    
    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->empleado = new Empleado($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerEmpleados(): void
    {
      $this->jsonResponseService->responder(['empleados' => $this->empleado->obtenerEmpleados()]);
    }
    

    public function solicitarQueja(array $data): void {
        $num_doc = $this->tokenService->validarToken();
        $this->responder('message', $this->empleado->solicitarQueja($num_doc, $data) ? 'Queja enviada' : 'Error al enviar la queja');
    }
   
  
 
  
}
