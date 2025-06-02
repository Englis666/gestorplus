<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Model;

use Service\DatabaseService;
use PDOException;
use Exception;

class Ausencia {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerAusencias(string $num_doc): array {
        try {
            $sql = "SELECT * FROM ausencia WHERE usuario_num_doc = :num_doc ORDER BY idausencia DESC;";
            $params = [':num_doc' => $num_doc];
            return $this->dbService->ejecutarConsulta($sql, $params, true);
        } catch (PDOException $e) {
            error_log("Error en obtenerAusencias: " . $e->getMessage());
            http_response_code(500);
            return [];
        }
    }

    public function obtenerTodasLasAusencias(): array {
        $sql = "SELECT * FROM ausencia";
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function ausenciaAceptada(int $idausencia): bool {
        try {
            $sql = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
            $params = [':idausencia' => $idausencia];
            $resultado = $this->dbService->ejecutarConsulta($sql, $params);
            
            // Cambia aquí: el test espera un array de arrays
            if (!empty($resultado) && isset($resultado[0]['usuario_num_doc'])) {
                $usuario_num_doc = $resultado[0]['usuario_num_doc'];

                $updateSql = "UPDATE ausencia SET justificada = 'Justificada' WHERE idausencia = :idausencia";
                $updateParams = [':idausencia' => $idausencia];
                $this->dbService->ejecutarUpdate($updateSql, $updateParams);

                // Insertar notificación
                $descripcionNotificacion = "Tu solicitud de ausencia ha sido aceptada.";
                $notificationSql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) VALUES (?, 'No leída', 'General', ?)";
                $notificationParams = [$descripcionNotificacion, $usuario_num_doc];
                $this->dbService->ejecutarInsert($notificationSql, $notificationParams);

                return true;
            }

            return false;
        } catch (PDOException $e) {
            error_log("Error en ausenciaAceptada: " . $e->getMessage());
            return false;
        }
    }

    public function ausenciaRechazada(int $idausencia): bool {
        try {
            $sql = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
            $params = [':idausencia' => $idausencia];
            $resultado = $this->dbService->ejecutarConsulta($sql, $params);
            
            if ($resultado) {
                $usuario_num_doc = $resultado['usuario_num_doc'];

                $updateSql = "UPDATE ausencia SET justificada = 'Rechazada' WHERE idausencia = :idausencia";
                $updateParams = [':idausencia' => $idausencia];
                $this->dbService->ejecutarUpdate($updateSql, $updateParams);

                $descripcionNotificacion = "Tu solicitud de ausencia ha sido rechazada.";
                $notificationSql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                    VALUES (?, 'No leída', 'General', ?)";
                $notificationParams = [$descripcionNotificacion, $usuario_num_doc];
                $this->dbService->ejecutarInsert($notificationSql, $notificationParams);

                return true;
            }

            return false;
        } catch (PDOException $e) {
            error_log("Error en ausenciaRechazada: " . $e->getMessage());
            return false;
        }
    }

    public function solicitarAusencia(string $num_doc, array $data): bool {
        try {
            $sql = "INSERT INTO ausencia (fechaInicio, fechaFin, tipoAusencia, descripcion, fechaRegistro, justificada, usuario_num_doc) 
                    VALUES (?, ?, ?, ?, ?, 'En proceso', ?)";
            $params = [
                $data['fechaInicio'],
                $data['fechaFin'],
                $data['tipoAusencia'],
                $data['descripcion'],
                date('Y-m-d H:i:s'),
                $num_doc
            ];
            $this->dbService->ejecutarInsert($sql, $params);

            $descripcionNotificacion = "El empleado identificado con la cédula $num_doc ha solicitado una ausencia desde el día " . 
                        $data['fechaInicio'] . " hasta el día " . $data['fechaFin'];
            $notificationSql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                VALUES (?, 'No leída', 'General', ?)";
            $notificationParams = [$descripcionNotificacion, $num_doc];
            $this->dbService->ejecutarInsert($notificationSql, $notificationParams);

            return true;
        } catch (Exception $e) {
            error_log("Error en solicitarAusencia: " . $e->getMessage());
            return false;
        }
    }
}
