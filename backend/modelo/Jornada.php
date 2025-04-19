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

    public function obtenerJornadas(): void {
        $num_doc = $this->validarToken();
        $this->responder('Jornadas', $this->empleado->obtenerJornadas($num_doc));
    }

    public function finalizarJornada(){
        $num_doc = $this->validarToken();
        $this->responder(['message' => $this->empleado->finalizarJornada($num_doc) ? 'Jornada finalizada' : 'Error al finalizar la jornada']);
    }


}