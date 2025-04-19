<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Permiso{

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

     
    private function ejecutarConsulta($sql, $params = []) {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Ocurrió un error en la base de datos']);
            http_response_code(500);
            return [];
        }
    }

    public function obtenerTodosLosPermisos(){
        $sql = "SELECT * FROM permiso as p
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc";
        return $this->ejecutarConsulta($sql);
    }

    public function obtenerPermisos($num_doc){ 
        try{
            $sql = "SELECT * FROM permiso as p
                    INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                    WHERE u.num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":num_doc" , $num_doc, PDO::PARAM_INT);
            $stmt->execute();

            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if($resultado){
                return $resultado;
            }
            return [];
        } catch (PDOException $e){
            echo json_encode(['error' => 'error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];                                  
        }
    }

    

 
    

    //realizar PermisoAceptado 

    //Realizar PermisoRechazado


}