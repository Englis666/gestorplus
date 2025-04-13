<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Calculo {
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    private function ejecutarConsulta($sql, $params = []){
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e){
            http_response_code(500);
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            exit;
        }
    }

    public function calcularHorasExtra(){
        $sql = "SELECT j.usuario_num_doc, j.horaEntrada, j.horaSalida, u.nombres, r.nombreRol
                FROM jornada j
                INNER JOIN usuario u ON j.usuario_num_doc = u.num_doc
                INNER JOIN rol r ON u.rol_idrol = r.idrol
                WHERE WEEK(j.fecha) = WEEK(CURDATE())";

        $jornadas = $this->ejecutarConsulta($sql);

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
                $this->registrarHorasExtra($num_doc, $horasExtra);

                $jornadasExtra[] = [
                    'num_doc' => $num_doc,
                    'nombres' => $datosUsuario[$num_doc]['nombres'],
                    'nombreRol' => $datosUsuario[$num_doc]['nombreRol'],
                    'horasExtra' => $horasExtra,
                ];
            }
        }

        return $jornadasExtra;
    }

    private function registrarHorasExtra($num_doc, $horasExtra){
        $sql = "SELECT horasExtra FROM horaextra 
                WHERE usuario_num_doc = :num_doc 
                AND DATE(fecha) = CURDATE()";

        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc);
        $stmt->execute();

        if($stmt->rowCount() > 0 ){
            $horasExistentes = $stmt->fetch(PDO::FETCH_ASSOC)['horasExtra'];

            if($horasExtra > $horasExistentes){
                $sql = "UPDATE horaextra 
                        SET horasExtra = :horasExtra 
                        WHERE usuario_num_doc = :num_doc 
                        AND DATE(fecha) = CURDATE()";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':num_doc', $num_doc);
                $stmt->bindParam(':horasExtra', $horasExtra);
                $stmt->execute();
            }
        } else {
            $sql = "INSERT INTO horaextra (usuario_num_doc, horasExtra, fecha) 
                    VALUES (:num_doc, :horasExtra, CURDATE())";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc);
            $stmt->bindParam(':horasExtra', $horasExtra);
            $stmt->execute();
        }
    }

    public function calcularPostulacionesEnConvocatorias(){
        $sql = "SELECT c.*, ca.nombreCargo , COUNT(p.idpostulacion) as cantidad_postulaciones
        FROM convocatoria AS c
        INNER JOIN  postulacion AS p ON c.idconvocatoria = p.convocatoria_idconvocatoria
        INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo
        GROUP BY c.idconvocatoria";
        
        return $this->ejecutarConsulta($sql); 
    }
    

}
