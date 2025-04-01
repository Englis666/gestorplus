<?php
namespace Controlador;

use Modelo\Archivo;
use Config\Database;
use Config\Clave;
use Firebase\JWT\JWT;
use Firebase\JWT\KEY;

class ArchivosControlador{
    private $db;
    private $archivo;


    public function __construct(){
        $database = new Database;
        $this->db = $database->getConnection();
        $this->archivo = new Archivo($this->db);
    }

    public function subirContrato(){

    }

    public function obtenerContrato(){

    }






}


?>