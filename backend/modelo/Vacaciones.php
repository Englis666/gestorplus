<?php
namespace Modelo;

use PDO;
use PDOException;
use Exception;

class Vacaciones {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    private function ejecutarConsulta(string $sql, array $params = []): array {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            error_log("Error en la base de datos: " . $e->getMessage());
            return [];
        }
    }

    public function obtenerTodasLasVacaciones(): array {
        $sql = "
            SELECT * FROM vacacion AS v 
            INNER JOIN usuario AS u ON v.usuario_num_doc = u.num_doc
        ";
        return $this->ejecutarConsulta($sql);
    }

    public function obtenerMisVacaciones(int $num_doc): array {
        $sql = "
            SELECT * FROM vacacion AS v
            INNER JOIN usuario AS u ON v.usuario_num_doc = u.num_doc
            WHERE usuario_num_doc = :num_doc
        ";
        return $this->ejecutarConsulta($sql, [':num_doc' => $num_doc]);
    }

    public function solicitarVacaciones(int $num_doc, array $data): bool {
        try {
            $estado = 'Pendiente';
            $sql = "
                INSERT INTO vacacion (fechaInicio, fechaFin, estadoVacacion, usuario_num_doc)
                VALUES (:fechaInicio, :fechaFin, :estado, :num_doc)
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':fechaInicio' => $data['fechaInicio'],
                ':fechaFin'    => $data['fechaFin'],
                ':estado'      => $estado,
                ':num_doc'     => $num_doc,
            ]);

            if ($stmt->rowCount() > 0) {
                $descripcion = "El empleado identificado con la cédula $num_doc ha solicitado una vacación";
                $sqlNoti = "
                    INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc)
                    VALUES (:descripcion, 'Pendiente', 'General', :num_doc)
                ";
                $stmtNoti = $this->db->prepare($sqlNoti);
                $stmtNoti->execute([
                    ':descripcion' => $descripcion,
                    ':num_doc'     => $num_doc
                ]);
                return true;
            }

            return false;
        } catch (Exception $e) {
            error_log("Error al solicitar vacaciones: " . $e->getMessage());
            return false;
        }
    }
}
