<?php
declare(strict_types = 1);

namespace Model;

use Service\DatabaseService;
use Exception;

class Vinculacion {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function asignarVinculacion(array $data): bool {
        try {
            $sql = "
                INSERT INTO vinculacion (
                    fechaInicio, fechaFin, tipoContrato, salario, 
                    estadoContrato, fechaFirma, evaluacionesSg_idevaluacion, usuario_num_doc
                ) VALUES (
                    :fechaInicio, :fechaFin, :tipoContrato, :salario,
                    :estadoContrato, :fechaFirma, :idevaluacion, :num_doc
                )
            ";

            $params = [
                ':fechaInicio'   => $data['fechaInicio'],
                ':fechaFin'      => $data['fechaFin'],
                ':tipoContrato'  => $data['tipoContrato'],
                ':salario'       => $data['salario'],
                ':estadoContrato'=> $data['estadoContrato'],
                ':fechaFirma'    => $data['fechaFirma'],
                ':idevaluacion'  => $data['idevaluacion'] ?? null,
                ':num_doc'       => $data['num_doc'],
            ];

            return $this->dbService->ejecutarAccion($sql, $params);
        } catch (Exception $e) {
            error_log("Error al asignar vinculación: " . $e->getMessage());
            return false;
        }
    }

    public function obtenerVinculaciones(): array {
        $sql = "
            SELECT * FROM vinculacion AS v
            INNER JOIN usuario AS u ON v.usuario_num_doc = u.num_doc
        ";
        return $this->dbService->ejecutarConsulta($sql) ?? [];
    }
}
