<?php
declare(strict_types=1);
namespace Model;

use Service\DatabaseService;

class Notificacion {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerTodasLasNotificaciones() {
        $sql = "SELECT * FROM notificacion";
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function obtenerNotificaciones(int $num_doc) {
        $sql = "SELECT * FROM notificacion WHERE num_doc = :num_doc";
        return $this->dbService->ejecutarConsulta($sql, ['num_doc' => $num_doc]);
    }

    public function obtenerNotificacionesAspirante(int $num_doc) {
        $sql = "SELECT * FROM notificacion 
                WHERE num_doc = :num_doc 
                AND (tipo = 'PostulacionAspirantes' OR tipo = 'entrevista')";
        return $this->dbService->ejecutarConsulta($sql, ['num_doc' => $num_doc]);
    }

    public function notificacionAceptada(int $idausencia): bool {
        $sqlUpdate = "UPDATE ausencia SET justificada = 'Justificada' WHERE idausencia = :idausencia";
        $actualizado = $this->dbService->ejecutarAccion($sqlUpdate, ['idausencia' => $idausencia]);

        if (!$actualizado) return false;

        // Obtener num_doc
        $sqlNumDoc = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
        $resultado = $this->dbService->ejecutarConsulta($sqlNumDoc, ['idausencia' => $idausencia], true);
        if (!$resultado || !isset($resultado['usuario_num_doc'])) return false;
        $numDoc = $resultado['usuario_num_doc'];

        $sqlInsertNoti = "INSERT INTO notificacion (descripcionNotificacion, tipo, num_doc) VALUES (?, ?, ?)";
        $idNotificacion = $this->dbService->ejecutarInsert($sqlInsertNoti, ['Ausencia aceptada', 'Aceptacion', $numDoc]);
        if ($idNotificacion === null) return false;

        $sqlRelacional = "INSERT INTO ausencia_has_notificacion (notificacion_idnotificacion, ausencia_idausencia) VALUES (?, ?)";
        return $this->dbService->ejecutarAccion($sqlRelacional, [$idNotificacion, $idausencia]);
    }

    public function notificacionRechazada(int $idausencia): bool {
        $sqlUpdate = "UPDATE ausencia SET justificada = 'Rechazada' WHERE idausencia = :idausencia";
        $actualizado = $this->dbService->ejecutarAccion($sqlUpdate, ['idausencia' => $idausencia]);

        if (!$actualizado) return false;

        $sqlNumDoc = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
        $resultado = $this->dbService->ejecutarConsulta($sqlNumDoc, ['idausencia' => $idausencia], true);
        if (!$resultado || !isset($resultado['usuario_num_doc'])) return false;
        $numDoc = $resultado['usuario_num_doc'];

        $sqlInsertNoti = "INSERT INTO notificacion (descripcionNotificacion, tipo, num_doc) VALUES (?, ?, ?)";
        $idNotificacion = $this->dbService->ejecutarInsert($sqlInsertNoti, ['Ausencia rechazada', 'Rechazo', $numDoc]);
        if ($idNotificacion === null) return false;

        $sqlRelacional = "INSERT INTO ausencia_has_notificacion (notificacion_idnotificacion, ausencia_idausencia) VALUES (?, ?)";
        return $this->dbService->ejecutarAccion($sqlRelacional, [$idNotificacion, $idausencia]);
    }
}
