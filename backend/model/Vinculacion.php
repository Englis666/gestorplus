<?php
namespace Model;

use Config\Database;
use PDO;
use PDOException;

class Vinculacion{
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


    public function asignarVinculacion($data){
        $sql = "INSERT INTO vinculacion (fechaInicio, fechaFin, tipoContrato, salario, estadoContrato, fechaFirma, evaluacionesSg_idevaluacion, usuario_num_doc)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['fechaInicio'],
            $data['fechaFin'],
            $data['tipoContrato'],
            $data['salario'],
            $data['estadoContrato'], 
            $data['fechaFirma'], 
            $data['idevaluacion'] ?? null, 
            $data['num_doc']
        ]);
    
        return $stmt->rowCount() > 0; 
    }
    

    public function obtenerVinculaciones() {
        $sql = "SELECT * FROM vinculacion as v 
                INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc";
        return $this->ejecutarConsulta($sql);
    }

  



}