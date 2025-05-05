<?php
declare(strict_types = 1);

namespace Model;

use Service\DatabaseService;
use PDOException;

class Certificado {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerDatosParaCertificado($num_doc) {
        try {
            $sql = "
                SELECT * FROM vinculacion AS v
                INNER JOIN usuario AS u ON v.usuario_num_doc = u.num_doc
                INNER JOIN rol AS r ON u.rol_idrol = r.idrol
                INNER JOIN evaluacionessg AS e ON v.evaluacionesSg_idevaluacion = e.idevaluacion
                INNER JOIN entrevista AS ent ON e.entrevista_identrevista = ent.identrevista
                INNER JOIN postulacion AS p ON ent.postulacion_idpostulaciones = p.idpostulacion
                INNER JOIN convocatoria AS c ON convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo AS car ON c.cargo_idcargo = car.idcargo
                WHERE u.num_doc = :num_doc
            ";

            $params = [':num_doc' => $num_doc];

            $resultado = $this->dbService->ejecutarConsulta($sql, $params);

            if ($resultado) {
                return $resultado;
            }

            return [];

        } catch (PDOException $e) {
            error_log("Error al obtener los datos para el certificado: " . $e->getMessage());
            return [];
        }
    }
}
