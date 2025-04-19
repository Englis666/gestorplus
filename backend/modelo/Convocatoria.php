<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Convocatoria{
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

    public function obtenerConvocatorias(){
        $sql = "SELECT * FROM convocatoria as c INNER JOIN cargo as ca 
                ON c.cargo_idCargo = ca.idCargo";
        return $this->ejecutarConsulta($sql);
    }

    public function agregarConvocatoria($data){
        $sql = "INSERT INTO convocatoria (nombreConvocatoria,descripcion,requisitos, salario,
                        cantidadConvocatoria, cargo_idcargo)
                                             VALUES ( ? , ? , ? , ? , ? , ?)";
         $stmt = $this->db->prepare($sql);
         $stmt->execute([
             $data['nombreConvocatoria'],
             $data['descripcion'],
             $data['requisitos'],
             $data['salario'],
             $data['cantidadConvocatoria'],
             $data['idcargo'],
         ]);
        return;
    }


    public function obtenerDetalleConvocatoria($idconvocatoria) {
        try {
            $sql = "SELECT * FROM convocatoria WHERE idconvocatoria = :idconvocatoria LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':idconvocatoria', $idconvocatoria, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($resultado) {
                return $resultado;
            }
            return null;
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return null;
        }
    }

}