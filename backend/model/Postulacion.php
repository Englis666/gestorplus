<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types = 1);

namespace Model;

use Service\DatabaseService;
use Exception;

class Postulacion {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerPostulacionesAspirante(int $num_doc): ?array {
        try {
            $sql = "
                SELECT * FROM postulacion p 
                INNER JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idCargo = ca.idCargo
                WHERE p.usuario_num_doc = :num_doc
            ";
            $params = [':num_doc' => $num_doc];
            return $this->dbService->ejecutarConsulta($sql, $params) ?? null;
        } catch (Exception $e) {
            error_log("Error al obtener postulaciones del aspirante: " . $e->getMessage());
            return null;
        }
    }

    public function obtenerPostulaciones(): array {
        try {
            $sql = "
                SELECT * FROM postulacion as p
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo
            ";
            return $this->dbService->ejecutarConsulta($sql) ?? [];
        } catch (Exception $e) {
            error_log("Error al obtener todas las postulaciones: " . $e->getMessage());
            return [];
        }
    }

    public function verificarPostulacion(int $num_doc, int $idconvocatoria): ?array {
        try {
            $sql = "
                SELECT * FROM postulacion 
                WHERE usuario_num_doc = :num_doc 
                AND convocatoria_idconvocatoria = :idconvocatoria
            ";
            $params = [
                ':num_doc' => $num_doc,
                ':idconvocatoria' => $idconvocatoria
            ];
            return $this->dbService->ejecutarConsulta($sql, $params, true) ?? null;
        } catch (Exception $e) {
            error_log("Error al verificar postulaciones: " . $e->getMessage());
            return null;
        }
    }

    public function obtenerPostulacionesAgrupadasPorConvocatoria(int $idconvocatoria): array {
        try {
            $sql = "
                SELECT 
                    u.num_doc,
                    u.nombres,
                    u.email,
                    p.idpostulacion,
                    ca.nombreCargo AS cargo,
                    h.*
                FROM postulacion p
                INNER JOIN usuario u ON p.usuario_num_doc = u.num_doc
                INNER JOIN hojadevida h ON u.hojadevida_idHojadevida = h.idHojadevida
                INNER JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo ca ON c.cargo_idcargo = ca.idcargo
                WHERE c.idconvocatoria = :idconvocatoria
            ";
            $params = [':idconvocatoria' => $idconvocatoria];
            return $this->dbService->ejecutarConsulta($sql, $params) ?? [];
        } catch (Exception $e) {
            error_log("Error al obtener postulaciones agrupadas: " . $e->getMessage());
            return [];
        }
    }
}
