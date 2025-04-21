<?php
namespace Controlador;


use Core\Controller\BaseController;
use Modelo\Usuario;
use PDO;
use Exception;

class UsuarioControlador extends BaseController {

    private PDO $db;
    private Usuario $usuario;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->usuario = new Usuario($this->db);
    }

    //chat
    public function obtenerRRHH() {
        $resultado = $this->usuario->obtenerRRHH();
        $this->jsonResponseService->responder([
            'status' => 'success',
            'RRHH' => $resultado ?: []
        ]);
    }
    
    public function obtenerUsuarios(){
        $resultado = $this->usuario->obtenerUsuarios(); 
        $this->jsonResponseService->responder([
            'status' => 'success',
            'RRHH' => $resultado ?: []
        ]);
    }
    
    
   
}

?>
