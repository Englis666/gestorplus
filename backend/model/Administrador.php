<?php
namespace Model;

use Config\Database;
use PDO;
use PDOException;

class Administrador {

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
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function obtenerCargos() {
        $sql = "SELECT * FROM cargo";
        return $this->ejecutarConsulta($sql);
    }

  







    

   

    
   
   

    
   
    



    



   

   
 

    
}



?>