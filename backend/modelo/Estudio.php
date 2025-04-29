<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Estudio {
    private $db;

    public function __construct($db) {
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
        try {

            $sql = "INSERT INTO estudio 
                    (nivelEstudio, areaEstudio, estadoEstudio, fechaInicioEstudio, 
                    fechaFinEstudio, tituloEstudio, institucionEstudio, ubicacionEstudio, modalidad, 
                    paisInstitucion, duracionEstudio, materiasDestacadas, hojadevida_idHojadevida) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
            // Preparar la consulta
            $stmtUsuario = $this->db->prepare($sql);
    
            // Ejecutar la consulta
            $stmtUsuario->execute([
                $data['nivelEstudio'],
                $data['areaEstudio'],
                $data['estadoEstudio'],
                $data['fechaInicioEstudio'],
                $data['fechaFinEstudio'],
                $data['tituloEstudio'],
                $data['institucionEstudio'],
                $data['ubicacionEstudio'],
                $data['modalidad'],
                $data['paisInstitucion'],
                $data['duracionEstudio'],
                $data['materiasDestacadas'],
                $hojadevida_idHojadevida
            ]);
    
            // Verificar si se insertó correctamente
            if ($stmtUsuario->rowCount() > 0) {
                return true;
            } else {
                throw new \Exception('No se pudo agregar el estudio.', 500); // Usando la clase estándar de PHP
            }
    
        } catch (PDOException $e) {
            // Manejo de errores de la base de datos
            throw new \Exception('Error en la base de datos: ' . $e->getMessage(), 500); // Usando la clase estándar de PHP
        } catch (\Exception $e) {
            // Manejo de otros errores
            throw new \Exception($e->getMessage(), $e->getCode()); // Usando la clase estándar de PHP
        }
    }

    public function actualizarEstudio($data) {
        $sql = "
            UPDATE estudio
            SET nivelEstudio = ?, areaEstudio = ?, estadoEstudio = ?, fechaInicioEstudio = ?, fechaFinEstudio = ?, tituloEstudio = ?, institucionEstudio = ?, ubicacionEstudio = ? WHERE idestudio = ?
        ";
    
        $stmt = $this->db->prepare($sql);
    
        $stmt->bindParam(1, $data['nivelEstudio'], PDO::PARAM_STR);
        $stmt->bindParam(2, $data['areaEstudio'], PDO::PARAM_STR);
        $stmt->bindParam(3, $data['estadoEstudio'], PDO::PARAM_STR);
        $stmt->bindParam(4, $data['fechaInicioEstudio'], PDO::PARAM_STR);
        $stmt->bindParam(5, $data['fechaFinEstudio'], PDO::PARAM_STR);
        $stmt->bindParam(6, $data['tituloEstudio'], PDO::PARAM_STR);
        $stmt->bindParam(7, $data['institucionEstudio'], PDO::PARAM_STR);
        $stmt->bindParam(8, $data['ubicacionEstudio'], PDO::PARAM_STR);
        $stmt->bindParam(9, $data['idestudio'], PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function eliminarEstudio($idestudio) {
        $sql = "DELETE FROM estudio WHERE idestudio = :idestudio";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idestudio', $idestudio, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
