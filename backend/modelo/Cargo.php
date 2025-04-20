<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Cargo {
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

    public function obtenerCargos() {
        $sql = "SELECT * FROM cargo";
        return $this->ejecutarConsulta($sql);
    }

    public function agregarCargo($nombreCargo) {
        $sql = "INSERT INTO cargo (nombreCargo, estadoCargo) VALUES (?, ?)";
        $stmt = $this->db->prepare($sql);
        
        if ($stmt->execute([$nombreCargo, "Activo"])) {
            return $this->db->lastInsertId();
        }

        return false;
    }
    

}
