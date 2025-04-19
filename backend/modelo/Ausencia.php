<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Ausencia{
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

    public function obtenerAusencias(): void {
        $num_doc = $this->validarToken();
        $this->responder('Ausencias', $this->empleado->obtenerAusencias($num_doc));
    }

    public function obtenerTodasLasAusencias() {
        $sql = "SELECT * FROM ausencia WHERE NOT justificada = 'Justificada'";
        return $this->ejecutarConsulta($sql);
    }

     
    public function solicitarAusencia(array $data): void {
        $num_doc = $this->validarToken();
        $this->responder('message', $this->empleado->solicitarAusencia($num_doc, $data) ? 'Ausencia solicitada' : 'Error al solicitar la ausencia');
    }

    public function asitenciaConfirmada($data){
        $sql = "UPDATE entrevista SET estadoEntrevista = 'Asistencia' WHERE identrevista = :identrevista";
        $stmt = $this->db-prepare($sql);
        $stmt->bindParam(':identrevista', $data['identrevista'] , PDO::PARAM_INT);
        return;
    }

    public function asistenciaNoConfirmada($data){
        $sql = "UPDATE entrevista SET estadoEntrevista = 'No asistio' WHERE identrevista = :identrevista";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(":identrevista" , $data['identrevista'], PDO::PARAM_INT);
        return;
    }
    


}