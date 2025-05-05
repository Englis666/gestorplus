<?php
declare(strict_types = 1);

namespace Model;
use Service\DatabaseService;
use Exception;

class Vacaciones {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerTodasLasVacaciones(): array {
        $sql = "
            SELECT * FROM vacacion AS v 
            INNER JOIN usuario AS u ON v.usuario_num_doc = u.num_doc
        ";
        return $this->dbService->ejecutarConsulta($sql) ?? [];
    }

    public function obtenerMisVacaciones(int $num_doc): array {
        $sql = "
            SELECT * FROM vacacion AS v
            INNER JOIN usuario AS u ON v.usuario_num_doc = u.num_doc
            WHERE usuario_num_doc = :num_doc
        ";
        return $this->dbService->ejecutarConsulta($sql, [':num_doc' => $num_doc]) ?? [];
    }

    public function solicitarVacaciones(int $num_doc, array $data): bool {
        try {
            $estado = 'Pendiente';

            $sqlVacacion = "
                INSERT INTO vacacion (fechaInicio, fechaFin, estadoVacacion, usuario_num_doc)
                VALUES (:fechaInicio, :fechaFin, :estado, :num_doc)
            ";

            $paramsVacacion = [
                ':fechaInicio' => $data['fechaInicio'],
                ':fechaFin'    => $data['fechaFin'],
                ':estado'      => $estado,
                ':num_doc'     => $num_doc,
            ];

            $insertado = $this->dbService->ejecutarAccion($sqlVacacion, $paramsVacacion);

            if ($insertado) {
                $descripcion = "El empleado identificado con la cédula $num_doc ha solicitado una vacación";

                $sqlNoti = "
                    INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc)
                    VALUES (:descripcion, 'Pendiente', 'General', :num_doc)
                ";

                $paramsNoti = [
                    ':descripcion' => $descripcion,
                    ':num_doc'     => $num_doc
                ];

                return $this->dbService->ejecutarAccion($sqlNoti, $paramsNoti);
            }

            return false;
        } catch (Exception $e) {
            error_log("Error al solicitar vacaciones: " . $e->getMessage());
            return false;
        }
    }
}
