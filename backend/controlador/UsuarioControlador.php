<?php
namespace Controlador;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Modelo\Usuario;
use Config\Database;
use Config\Clave;

class UsuarioControlador {

    private $db;
    private $usuario;

    public function __construct() {
        $this->db = (new DataBase())->getConnection();
        $this->usuario = new Usuario($this->db);
    }

    private function jsonResponse($status, $message, $data = []) {
        echo json_encode(array_merge(['status' => $status, 'message' => $message], $data));
    }

    //chat
    public function obtenerRRHH() {
        $resultado = $this->usuario->obtenerRRHH();
        $this->jsonResponse('success', '', ['RRHH' => $resultado ?: []]);
    }

    //Certificado
   

   
}

?>
