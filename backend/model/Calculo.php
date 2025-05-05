<?php
namespace Model;

use Service\DatabaseService;
use PDO;

class Calculo {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    public function calcularHorasExtra() {
        $sql = "SELECT * FROM jornada j
                INNER JOIN usuario u ON j.usuario_num_doc = u.num_doc
                INNER JOIN rol r ON u.rol_idrol = r.idrol
                WHERE WEEK(j.fecha) = WEEK(CURDATE())";

        $jornadas = $this->dbService->ejecutarConsulta($sql);

        if (empty($jornadas)) {
            return [];
        }

        $totalHorasSemana = [];
        $datosUsuario = [];

        foreach ($jornadas as $jornada) {
            $num_doc = $jornada['usuario_num_doc'];
            $horaEntrada = strtotime($jornada['horaEntrada']);
            $horaSalida = strtotime($jornada['horaSalida']);
            $horasTrabajadas = ($horaSalida - $horaEntrada) / 3600;

            $totalHorasSemana[$num_doc] = ($totalHorasSemana[$num_doc] ?? 0) + $horasTrabajadas;
            $datosUsuario[$num_doc] = [
                'nombres' => $jornada['nombres'],
                'nombreRol' => $jornada['nombreRol']
            ];
        }

        $jornadasExtra = [];

        foreach ($totalHorasSemana as $num_doc => $totalHoras) {
            if ($totalHoras > 48) {
                $horasExtra = $totalHoras - 48;
                $jornadasExtra[] = [
                    'num_doc' => $num_doc,
                    'nombres' => $datosUsuario[$num_doc]['nombres'],
                    'nombreRol' => $datosUsuario[$num_doc]['nombreRol'],
                    'horasExtra' => $horasExtra,
                ];
            }
        }

        foreach ($jornadasExtra as $jornada) {
            $sql = "SELECT horasExtra FROM horaextra 
                    WHERE usuario_num_doc = :num_doc 
                    AND DATE(fecha) = CURDATE()";

            $params = [':num_doc' => $jornada['num_doc']];
            $result = $this->dbService->ejecutarConsulta($sql, $params, true);

            if ($result) {
                $horasExistentes = $result['horasExtra'];

                if ($jornada['horasExtra'] > $horasExistentes) {
                    $sql = "UPDATE horaextra 
                            SET horasExtra = :horasExtra 
                            WHERE usuario_num_doc = :num_doc 
                            AND DATE(fecha) = CURDATE()";

                    $params = [
                        ':num_doc' => $jornada['num_doc'],
                        ':horasExtra' => gmdate("H:i:s", $jornada['horasExtra'] * 3600),
                    ];
                    $this->dbService->ejecutarUpdate($sql, $params);
                }
            } else {
                $sql = "INSERT INTO horaextra (usuario_num_doc, horasExtra, fecha) 
                        VALUES (:num_doc, :horasExtra, CURDATE())";

                $params = [
                    ':num_doc' => $jornada['num_doc'],
                    ':horasExtra' => gmdate("H:i:s", $jornada['horasExtra'] * 3600),
                ];
                $this->dbService->ejecutarInsert($sql, $params);
            }
        }

        return $jornadasExtra;
    }

    public function calcularPostulacionesEnConvocatorias() {
        $sql = "SELECT c.*, ca.nombreCargo , COUNT(p.idpostulacion) as cantidad_postulaciones, p.idpostulacion
                FROM convocatoria AS c
                INNER JOIN postulacion AS p ON c.idconvocatoria = p.convocatoria_idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo
                GROUP BY c.idconvocatoria";
        
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function obtenerMinutosTrabajados($num_doc) {
        $sql = "SELECT 
                    j.idJornada,
                    j.fecha,
                    j.horaEntrada,
                    u.nombres,
                    j.horaSalida,
                    TIMESTAMPDIFF(MINUTE, 
                        CONCAT(DATE(j.fecha), ' ', j.horaEntrada), 
                        IF(TIMESTAMPDIFF(MINUTE, CONCAT(DATE(j.fecha), ' ', j.horaEntrada), CONCAT(DATE(j.fecha), ' ', j.horaSalida)) < 0,
                            CONCAT(DATE(j.fecha + INTERVAL 1 DAY), ' ', j.horaSalida),
                            CONCAT(DATE(j.fecha), ' ', j.horaSalida)
                        )
                    ) AS minutos_trabajados,
                    CASE
                        WHEN TIMESTAMPDIFF(MINUTE, 
                            CONCAT(DATE(j.fecha), ' ', j.horaEntrada), 
                            IF(TIMESTAMPDIFF(MINUTE, CONCAT(DATE(j.fecha), ' ', j.horaEntrada), CONCAT(DATE(j.fecha), ' ', j.horaSalida)) < 0,
                                CONCAT(DATE(j.fecha + INTERVAL 1 DAY), ' ', j.horaSalida),
                                CONCAT(DATE(j.fecha), ' ', j.horaSalida)
                            )
                        ) > 480 
                        THEN TIMESTAMPDIFF(MINUTE, 
                            CONCAT(DATE(j.fecha), ' ', j.horaEntrada), 
                            IF(TIMESTAMPDIFF(MINUTE, CONCAT(DATE(j.fecha), ' ', j.horaEntrada), CONCAT(DATE(j.fecha), ' ', j.horaSalida)) < 0,
                                CONCAT(DATE(j.fecha + INTERVAL 1 DAY), ' ', j.horaSalida),
                                CONCAT(DATE(j.fecha), ' ', j.horaSalida)
                            )
                        ) - 480
                        ELSE 0
                    END AS minutos_extra
                FROM jornada as j
                INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc 
                WHERE j.usuario_num_doc = :num_doc
                LIMIT 1";

        $params = [':num_doc' => $num_doc];
        return $this->dbService->ejecutarConsulta($sql, $params, true);
    }

    public function obtenerMinutosTrabajadosDelEmpleado() {
        $sql = "SELECT 
                j.idJornada,
                j.fecha,
                j.horaEntrada,
                j.horaSalida,
                u.nombres,
                u.apellidos,
                u.num_doc,
                TIMESTAMPDIFF(MINUTE, 
                    CONCAT(DATE(j.fecha), ' ', j.horaEntrada), 
                    IF(TIMESTAMPDIFF(MINUTE, CONCAT(DATE(j.fecha), ' ', j.horaEntrada), CONCAT(DATE(j.fecha), ' ', j.horaSalida)) < 0,
                        CONCAT(DATE(j.fecha + INTERVAL 1 DAY), ' ', j.horaSalida),
                        CONCAT(DATE(j.fecha), ' ', j.horaSalida)
                    )
                ) AS minutos_trabajados,
                CASE
                    WHEN TIMESTAMPDIFF(MINUTE, 
                        CONCAT(DATE(j.fecha), ' ', j.horaEntrada), 
                        IF(TIMESTAMPDIFF(MINUTE, CONCAT(DATE(j.fecha), ' ', j.horaEntrada), CONCAT(DATE(j.fecha), ' ', j.horaSalida)) < 0,
                            CONCAT(DATE(j.fecha + INTERVAL 1 DAY), ' ', j.horaSalida),
                            CONCAT(DATE(j.fecha), ' ', j.horaSalida)
                        )
                    ) > 480 
                    THEN TIMESTAMPDIFF(MINUTE, 
                        CONCAT(DATE(j.fecha), ' ', j.horaEntrada), 
                        IF(TIMESTAMPDIFF(MINUTE, CONCAT(DATE(j.fecha), ' ', j.horaEntrada), CONCAT(DATE(j.fecha), ' ', j.horaSalida)) < 0,
                            CONCAT(DATE(j.fecha + INTERVAL 1 DAY), ' ', j.horaSalida),
                            CONCAT(DATE(j.fecha), ' ', j.horaSalida)
                        )
                    ) - 480
                    ELSE 0
                END AS minutos_extra
            FROM jornada as j
            INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc 
            ORDER BY j.fecha DESC";

        return $this->dbService->ejecutarConsulta($sql);
    }
}
