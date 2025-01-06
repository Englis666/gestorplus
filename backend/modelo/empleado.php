<?php
require_once 'config/config.php';
class Empleado {

    private $db;
    public function __construct($db){
        $this->db = $db;
    }

    public function obtenerNotificaciones($num_doc){
        try{
            $sql = "SELECT * FROM notificacion WHERE num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if($resultado){
                return $resultado;
            }
            return [];
        }catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }
    
    public function obtenerJornadas($num_doc){
        try{
            $sql = "SELECT * FROM jornada as j
                    INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc
                    WHERE u.num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_STR);  
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            if($resultado){
                return $resultado;
            }
        }catch (PDOException $e) {
        echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
        http_response_code(500);
        return [];
        }
    }


    public function obtenerAusencias($num_doc){
    try{
        $sql = "SELECT * FROM ausencia WHERE usuario_num_doc = :num_doc";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc' , $num_doc , PDO::PARAM_STR);
        $stmt->execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
    }catch (PDOException $e) {
        echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
        http_response_code(500);
        return [];
        }
    }

}

?>