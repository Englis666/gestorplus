<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class PazySalvo{

    private $db;

    public function __construct($db){
        $this->db = $db;
    }    

    private function ejectuarConsulta($sql, $params = []){
        try{
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e){
            echo json_encode(['error' => 'Ocurrio un error en la base de datos']);
            http_response_code(500);
            return [];
        }
    }  

    public function obtenerPazYSalvos(){
        $sql = "SELECT * FROM pazysalvo";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

    public function obtenerMiPazYSalvo($num_doc) {
        try {
            $sql = "SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc";
            $stmtVinculacion = $this->db->prepare($sql);
            $stmtVinculacion->bindParam(':num_doc', $num_doc, PDO::PARAM_STR); 
            $stmtVinculacion->execute();
    
            $vinculacion = $stmtVinculacion->fetch(PDO::FETCH_ASSOC);
    
            if ($vinculacion) {
                $sql = "SELECT * FROM pazysalvo WHERE vinculacion_idvinculacion = :vinculacion_idvinculacion";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':vinculacion_idvinculacion', $vinculacion_idvinculacion, PDO::PARAM_INT);
                $stmt->execute();
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                return $resultado ? $resultado : [];
            }
    
            return []; 
    
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }
    






}
