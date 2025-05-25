<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types = 1);

namespace Model;

use Service\DatabaseService;
use PDO;
use PDOException;

class Aspirante {

    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    public function obtenerDetalleConvocatoria($idconvocatoria) {
        try {
            $sql = "SELECT * FROM convocatoria WHERE idconvocatoria = :idconvocatoria LIMIT 1";
            $params = [':idconvocatoria' => $idconvocatoria];
            return $this->dbService->ejecutarConsulta($sql, $params, true);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return null;
        }
    }

    public function obtenerNotificacionesAspirante($num_doc) {
        try {
            $sql = "SELECT * FROM notificacion WHERE num_doc = :num_doc AND tipo = 'PostulacionAspirantes'";
            $params = [':num_doc' => $num_doc];
            return $this->dbService->ejecutarConsulta($sql, $params);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function verificarPostulacion($num_doc, $idconvocatoria) {
        try {
            $sql = 'SELECT * FROM postulacion WHERE usuario_num_doc = :num_doc AND convocatoria_idconvocatoria = :idconvocatoria';
            $params = [':num_doc' => $num_doc, ':idconvocatoria' => $idconvocatoria];
            return $this->dbService->ejecutarConsulta($sql, $params, true);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return null;
        }
    }

    public function aplicacionDeAspirante($num_doc, $idconvocatoria) {
        try {
            $sql = "INSERT INTO postulacion (usuario_num_doc, convocatoria_idconvocatoria, estadoPostulacion) VALUES (?, ?, ?)";
            $params = [$num_doc, $idconvocatoria, "En proceso"];
            if ($this->dbService->ejecutarInsert($sql, $params)) {
                
                $descripcionNotificacion = 'Has aplicado a una convocatoria';
                $estadoNotificacion = 'No leida';
                $tipo = 'PostulacionAspirantes';
                $insert = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                           VALUES (?, ?, ?, ?)";
                $paramsNotif = [$descripcionNotificacion, $estadoNotificacion, $tipo, $num_doc];
                if (!$this->dbService->ejecutarInsert($insert, $paramsNotif)) {
                    throw new PDOException("Error al insertar la notificación para el aspirante");
                }

                $descripcionNotificacion2 = "El aspirante con número de documento $num_doc ha aplicado a una convocatoria";
                $tipo2 = 'Postulacion';
                $insert2 = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                            VALUES (?, ?, ?, ?)";
                $paramsNotif2 = [$descripcionNotificacion2, $estadoNotificacion, $tipo2, $num_doc];
                if (!$this->dbService->ejecutarInsert($insert2, $paramsNotif2)) {
                    throw new PDOException("Error al insertar la notificación para RRHH");
                }

                return true;
            } else {
                echo json_encode(['error' => 'Error al insertar la aplicación']);
                return false;
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return false;
        }
    }
}
