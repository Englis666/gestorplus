<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Estadistica{
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

    public function obtenerTotalEstadisticas($num_doc, $rol = null) {
        if ($rol === 'Administrador') {
            return $this->obtenerEstadisticasGlobales();
        }
        return $this->obtenerEstadisticasPorUsuario($num_doc);
    }

    private function obtenerEstadisticasGlobales() {
        $sql = "
            SELECT 
                (SELECT COUNT(*) FROM notificacion WHERE tipo = 'Jornada') AS totalJornadas,
                (SELECT COUNT(*) FROM notificacion WHERE tipo = 'General') AS totalGenerales,
                (SELECT COUNT(*) FROM notificacion 
                    WHERE tipo = 'Rechazo' OR tipo = 'Aceptacion') AS totalActualizaciones
        ";

        // Preparar y ejecutar la consulta
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        // Obtener el resultado de la consulta
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si el resultado existe, devolver las estadísticas
        if ($resultado) {
            return [
                'totalJornadas' => $resultado['totalJornadas'] ?? 0,
                'totalGenerales' => $resultado['totalGenerales'] ?? 0,
                'totalActualizaciones' => $resultado['totalActualizaciones'] ?? 0
            ];
        }

        return null;
    }

    private function obtenerEstadisticasPorUsuario($num_doc) {
        $sql = "
            SELECT 
                SUM(CASE WHEN tipo = 'Jornada' THEN 1 ELSE 0 END) AS totalJornadas,
                SUM(CASE WHEN tipo = 'General' THEN 1 ELSE 0 END) AS totalGenerales,
                SUM(CASE WHEN tipo = 'Rechazo' OR tipo = 'Aceptacion' THEN 1 ELSE 0 END) AS totalActualizaciones
            FROM notificacion
            WHERE num_doc = :num_doc;
        ";

        // Preparar la consulta y asociar el parámetro num_doc
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
        $stmt->execute();

        // Obtener el resultado de la consulta
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si el resultado existe, devolver las estadísticas
        if ($resultado) {
            return [
                'totalJornadas' => $resultado['totalJornadas'] ?? 0,
                'totalGenerales' => $resultado['totalGenerales'] ?? 0,
                'totalActualizaciones' => $resultado['totalActualizaciones'] ?? 0
            ];
        }

        return null;
    }

}