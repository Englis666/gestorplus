<?php
namespace Model;

use Config\Database;
use PDO;
use PDOException;

class Calculo {
    private $db;

    // Constructor que recibe la conexión a la base de datos
    public function __construct($db){
        $this->db = $db;
    }

    public function calcularHorasExtra(){
        $sql = "SELECT * FROM jornada j
                INNER JOIN usuario u ON j.usuario_num_doc = u.num_doc
                INNER JOIN rol r ON u.rol_idrol = r.idrol
                WHERE WEEK(j.fecha) = WEEK(CURDATE())";
        
        $stmt = $this->db->prepare($sql);
        
        try {
            $stmt->execute();
        } catch (PDOException $e) {
            echo "Error en la ejecución de la consulta: " . $e->getMessage() . "\n";
            exit;
        }

        // Recupera todos los resultados de las jornadas
        $jornadas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($jornadas)) {
            return [];
        }


        $totalHorasSemana = [];
        $datosUsuario = [];

        // Calculamos las horas trabajadas y las acumulamos
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

        // Filtramos las jornadas que superan las 48 horas de trabajo
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



        // Registrar las horas extra en la base de datos
        foreach ($jornadasExtra as $jornada) {
            $sql = "SELECT horasExtra FROM horaextra 
                    WHERE usuario_num_doc = :num_doc 
                    AND DATE(fecha) = CURDATE()";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $jornada['num_doc']);
            
            try {
                $stmt->execute();
            } catch (PDOException $e) {
                echo "Error al ejecutar la consulta para verificar horas extra: " . $e->getMessage() . "\n";
                exit;
            }

            if ($stmt->rowCount() > 0) {
                $horasExistentes = $stmt->fetch(PDO::FETCH_ASSOC)['horasExtra'];

                if ($jornada['horasExtra'] > $horasExistentes) {
                    $sql = "UPDATE horaextra 
                            SET horasExtra = :horasExtra 
                            WHERE usuario_num_doc = :num_doc 
                            AND DATE(fecha) = CURDATE()";
                    $stmt = $this->db->prepare($sql);
                    $stmt->bindParam(':num_doc', $jornada['num_doc']);
                    $stmt->bindParam(':horasExtra', $jornada['horasExtra']);

                    try {
                        $stmt->execute();
                    } catch (PDOException $e) {
                        echo "Error al ejecutar la actualización de horas extra: " . $e->getMessage() . "\n";
                        exit;
                    }
                }
            } else {
                // Convertir horas extra a formato TIME (hh:mm:ss)
                $horasExtraFormato = gmdate("H:i:s", $jornada['horasExtra'] * 3600);

                $sql = "INSERT INTO horaextra (usuario_num_doc, horasExtra, fecha) 
                        VALUES (:num_doc, :horasExtra, CURDATE())";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':num_doc', $jornada['num_doc']);
                $stmt->bindParam(':horasExtra', $horasExtraFormato);
                
                try {
                    $stmt->execute();
                } catch (PDOException $e) {
                    echo "Error al ejecutar la inserción de horas extra: " . $e->getMessage() . "\n";
                    exit;
                }
            }
        }

      return $jornadasExtra;
    }

    // Método para calcular la cantidad de postulaciones en convocatorias
    public function calcularPostulacionesEnConvocatorias(){
        $sql = "SELECT c.*, ca.nombreCargo , COUNT(p.idpostulacion) as cantidad_postulaciones, p.idpostulacion
                FROM convocatoria AS c
                INNER JOIN postulacion AS p ON c.idconvocatoria = p.convocatoria_idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo
                GROUP BY c.idconvocatoria";
        
        return $this->ejecutarConsulta($sql); 
    }

    


    private function ejecutarConsulta($sql){
        $stmt = $this->db->prepare($sql);
        
        try {
            $stmt->execute();
        } catch (PDOException $e) {
            echo "Error al ejecutar la consulta: " . $e->getMessage() . "\n";
            exit;
        }
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
    
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc);
    
        try {
            $stmt->execute();
        } catch (PDOException $e) {
            echo "Error al ejecutar la consulta de jornada del día: " . $e->getMessage() . "\n";
            return null;
        }
    
        return $stmt->fetch(PDO::FETCH_ASSOC);
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
            FROM jornada AS j
            INNER JOIN usuario AS u ON j.usuario_num_doc = u.num_doc;";
    
        $stmt = $this->db->prepare($sql);
    
        try {
            $stmt->execute();
        } catch (PDOException $e) {
            echo "Error al ejecutar la consulta de jornada del día: " . $e->getMessage() . "\n";
            return null;
        }
    
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    



}
