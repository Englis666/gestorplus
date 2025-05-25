<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types = 1);
namespace Model;

use Service\DatabaseService;
use PDOException;

class Empleado {
    private DatabaseService $dbService;
    
    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }
    
    public function obtenerEmpleados($pagina = 1, $registrosPorPagina = 10) {
    $offset = ($pagina - 1) * $registrosPorPagina;

    $sql = "SELECT 
                v.fechaInicio, 
                v.fechaFin, 
                u.num_doc, 
                u.email, 
                u.nombres, 
                u.apellidos, 
                u.tipodDoc, 
                ca.nombreCargo 
            FROM vinculacion AS v
            INNER JOIN usuario AS u ON v.usuario_num_doc = u.num_doc
            INNER JOIN postulacion AS p ON u.num_doc = p.usuario_num_doc
            INNER JOIN convocatoria AS c ON p.convocatoria_idconvocatoria = c.idconvocatoria
            INNER JOIN cargo AS ca ON c.cargo_idcargo = ca.idcargo
            LIMIT $registrosPorPagina OFFSET $offset";
    
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
