<?php
declare(strict_types=1);
namespace Model;

use Service\DatabaseService;

class Estadistica {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
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
                (SELECT COUNT(*) FROM notificacion WHERE tipo IN ('Rechazo', 'Aceptacion')) AS totalActualizaciones
        ";

        $resultado = $this->dbService->ejecutarConsulta($sql, [], true);

        return $resultado ?: [
            'totalJornadas' => 0,
            'totalGenerales' => 0,
            'totalActualizaciones' => 0
        ];
    }

    private function obtenerEstadisticasPorUsuario($num_doc) {
        $sql = "
            SELECT 
                SUM(CASE WHEN tipo = 'Jornada' THEN 1 ELSE 0 END) AS totalJornadas,
                SUM(CASE WHEN tipo = 'General' THEN 1 ELSE 0 END) AS totalGenerales,
                SUM(CASE WHEN tipo IN ('Rechazo', 'Aceptacion') THEN 1 ELSE 0 END) AS totalActualizaciones
            FROM notificacion
            WHERE num_doc = :num_doc
        ";

        $params = [':num_doc' => $num_doc];
        $resultado = $this->dbService->ejecutarConsulta($sql, $params, true);

        return $resultado ?: [
            'totalJornadas' => 0,
            'totalGenerales' => 0,
            'totalActualizaciones' => 0
        ];
    }
}
