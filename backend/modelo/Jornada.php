<?php
namespace Modelo;
use Config\Database;
use PDO;
use PDOException;

class Jornada{
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    private function ejecutarConsulta($sql, $params = []){
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

    public function corroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 'Jornada Corroborada' WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }

    public function noCorroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 'Jornada rechazada' WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }


    public function obtenerTodasLasJornadas() {
        $sql = "SELECT * FROM jornada as j
                INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc
                WHERE NOT estadoJornada = 'Jornada Corroborada'";
        return $this->ejecutarConsulta($sql);
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

    
    public function finalizarJornada($num_doc){
        date_default_timezone_set('America/Bogota');
        $fecha = date('Y-m-d');
        $horaSalida = date('H:i:s');
    
        $sql = "UPDATE jornada 
                SET horaSalida = ?, estadoJornada = 'Finalizada' 
                WHERE usuario_num_doc = ? AND fecha = ? AND horaSalida IS NULL";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$horaSalida, $num_doc, $fecha]);
    }



}