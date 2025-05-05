<?php
declare(strict_types = 1);
namespace Controller;
use Model\Usuario;
use Core\Controllers\BaseController;
use Service\DatabaseService;
use Exception;

class UsuarioController extends BaseController {
    private Usuario $usuario;

    public function __construct() {
        parent::__construct();
        $this->usuario = new Usuario($this->dbService);
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
            'status'  => 'success',
            'message' => 'Usuarios obtenidos correctamente',
            'RRHH'    => $resultado ?: [],
        ]);
    }
    
    


}

?>
