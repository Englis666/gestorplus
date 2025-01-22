<?php
// MODELO
require_once 'config/config.php';

class Administrador {

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function obtenerTodasLasNotificaciones(){
        try{
            $sql = "SELECT * FROM notificacion";
            $stmt = $this->db->prepare($sql);
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

    public function obtenerTodasLasJornadas(){
        try{
            $sql = "SELECT * FROM jornada as j
                    INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc
                    ";
            $stmt = $this->db->prepare($sql);
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

    public function obtenerTodasLasAusencias(){
        try{
            $sql = "SELECT * FROM ausencia";
            $stmt = $this->db->prepare($sql);
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

    public function obtenerUsuarios(){
        $sql = "SELECT * FROM usuario as u
                INNER JOIN rol as r ON u.rol_idrol = idrol
                WHERE r.nombreRol = 'Empleados'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }


    public function corroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 1 WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }
    public function noCorroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 0 WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }


}



?>