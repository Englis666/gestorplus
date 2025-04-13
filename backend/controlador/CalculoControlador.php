<?php
namespace Controlador;

use Config\Database;
use Config\Clave;
use Modelo\Calculo;
 
use Exception;

class CalculoControlador{
    private $db;
    private $calculo;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->calculo = new Calculo($this->db);
    }

    private function jsonResponse(array $data, int $statusCode = 200):void{
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }



    private function responder(string $clave, $resultado): void{
        $this->jsonResponse([$clave => $resultado ?: []]);
    }

    public function calcularPostulacionesEnConvocatorias(){
        $this->responder('convocatorias',  $this->calculo->calcularPostulacionesEnConvocatorias());
    }

}