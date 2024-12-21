<?php
require_once 'config/config.php';
class Empleado {

    private $db;
    public function __construct($db){
        $this->db = $db;
    }

    public function obtenerNotificaciones(){
        $sql = "SELECT * FROM notificacion";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
    return [];
    }
    
    public function obtenerJornadas(){
        $sql = "SELECT * FROM jornada as j
                INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

     
    public function obtenerAusencias(){
        $sql = "SELECT * FROM ausencia";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

}

?>