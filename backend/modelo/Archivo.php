<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Archivo{
    private $db;


    public function __construct($db){
        $this->db = $db;
    }

    public function subirContrato(){
        if(isset($_FILES['archivo'])){
            $archivo = $_FILES['archivo'];

            if($archivo['error'] !== UPLOAD_ERR_OK){
                echo json_encode(["error" => 'Error al subir el archivo']);
                return;
            }
            $directorio = __DIR__ . '/uploads';
            if(!$file_Exist($directorio)){
                mkdir($directorio, 077, true);
            }

            $rutaDestino = $directorio . basename($archivo['name']);
            if(move_uploaded_file($archivo['tmp_name'], $rutaDestino)){
                echo json_encode(["mensaje" => 'Archivo subido con exito']);
            } else {
                echo json_encode(['error' => 'No se pudo mover el archivo']);
            }
        } else {
            echo json_encode(['error' => 'No se recibio ningun archivo']);
        }


    }

    public function obtenerContrato(){

    }

    public function subirFotoHojaDeVida(){

    }

    


}



?>