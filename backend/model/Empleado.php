<?php
declare(strict_types = 1);
namespace Model;

use Service\DatabaseService;
use PDOException;

class Empleado {
    private DatabaseService $dbService;
    
    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }
    
    public function obtenerEmpleados() {
        $sql = "SELECT * FROM vinculacion as v
                INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc
                INNER JOIN postulacion as p ON u.num_doc = p.usuario_num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";
        
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function solicitarQueja($num_doc, $data) {
        try {
            $descripcionNotificacion = 'El usuario identificado con el número de documento '.$num_doc.' ha realizado una queja relacionada con la jornada ' . $data['fecha'];

            $sql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc)
                    VALUES (:descripcionNotificacion, :estadoNotificacion, :tipo, :num_doc)";
            
            $params = [
                ':descripcionNotificacion' => $descripcionNotificacion,
                ':estadoNotificacion' => 'Pendiente',
                ':tipo' => 'General',
                ':num_doc' => $num_doc,
            ];

            $id = $this->dbService->ejecutarConsulta($sql, $params, true);

            if ($id) {
                return $id;
            }

            return 0; 
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return 0;
        }
    }
}
?>
