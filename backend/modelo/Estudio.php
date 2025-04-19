<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Estudio{
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
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function obtenerEstudio($idhojadevida) {
        $sql = "
        SELECT * FROM estudio WHERE hojadevida_idhojadevida = :idhojadevida";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idhojadevida', $idhojadevida, PDO::PARAM_INT);
        $stmt->execute();
    
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if ($resultado) {
            return $resultado;
        } else {
            return false;
        }
    }
    public function agregarEstudio($data, $hojadevida_idHojadevida) {
        $sql = "INSERT INTO estudio 
                (nivelEstudio, areaEstudio, estadoEstudio, fechaInicioEstudio, 
                fechaFinEstudio, tituloEstudio, institucionEstudio, ubicacionEstudio, hojadevida_idHojadevida) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmtUsuario = $this->db->prepare($sql);    
        $stmtUsuario->execute([
                    $data['nivelEstudio'],
                    $data['areaEstudio'],
                    $data['estadoEstudio'],
                    $data['fechaInicioEstudio'],
                    $data['fechaFinEstudio'],
                    $data['tituloEstudio'],
                    $data['institucionEstudio'],
                    $data['ubicacionEstudio'],
                    $hojadevida_idHojadevida
        ]);    
    
        return json_encode(['message' => 'Estudio agregado']);
    }

      
    public function eliminarEstudio($idestudio) {
        $sql = "DELETE FROM estudio WHERE idestudio = :idestudio";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idestudio', $idestudio, PDO::PARAM_INT);

        return $stmt->execute();
    }

}