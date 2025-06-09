<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Model;

use Service\DatabaseService;

class Entrevista {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerEntrevistas() {
        $sql = "SELECT * FROM entrevista AS e
                INNER JOIN postulacion AS p ON e.postulacion_idpostulaciones = p.idpostulacion
                INNER JOIN usuario AS u ON p.usuario_num_doc = u.num_doc
                INNER JOIN convocatoria AS c ON p.convocatoria_idconvocatoria = c.idconvocatoria";

        try {
            return $this->dbService->ejecutarConsulta($sql, []);
        } catch (PDOException $e) {
            throw new \Exception('Error al obtener entrevistas: ' . $e->getMessage(), 500);
        }
    }

    public function obtenerDatosDelEntrevistado($num_doc) {
        $sqlDatos = "SELECT 
                        *
                     FROM postulacion AS p
                     INNER JOIN entrevista AS e ON p.idpostulacion = e.postulacion_idpostulaciones
                     INNER JOIN usuario AS u ON p.usuario_num_doc = u.num_doc
                     INNER JOIN hojadevida AS h ON u.hojadevida_idHojadevida = h.idHojadevida
                     WHERE u.num_doc = :num_doc";
        
        try {
            $datos = $this->dbService->ejecutarConsulta($sqlDatos, [':num_doc' => $num_doc]);
            if (!$datos) return null;

            $datos = $datos[0];

            $sqlEstudios = "SELECT * FROM estudio WHERE hojadevida_idHojadevida = :idHojadevida";
            $estudios = $this->dbService->ejecutarConsulta($sqlEstudios, [':idHojadevida' => $datos['idHojadevida']]);

            $sqlExperiencia = "SELECT * FROM experiencialaboral WHERE hojadevida_idHojadevida = :idHojadevida";
            $experiencias = $this->dbService->ejecutarConsulta($sqlExperiencia, [':idHojadevida' => $datos['idHojadevida']]);

            $datos['estudios'] = $estudios ?: [];
            $datos['experiencias'] = $experiencias ?: [];

            return $datos;
        } catch (PDOException $e) {
            throw new \Exception('Error al obtener los datos del entrevistado: ' . $e->getMessage(), 500);
        }
    }

    public function asignarEntrevista($data): bool {
        $estado = "Pendiente";
        $sql = "INSERT INTO entrevista (fecha, hora, lugarMedio, postulacion_idpostulaciones, estadoEntrevista)
                VALUES (?, ?, ?, ?, ?)";

        try {
            $this->dbService->ejecutarConsulta($sql, [
                $data['fecha'],
                $data['hora'],
                $data['lugarMedio'],
                $data['postulacion_idpostulaciones'],
                $estado
            ]);

            $buscarNumDoc = "SELECT usuario_num_doc FROM postulacion WHERE idpostulacion = :postulacion_id";
            $usuario = $this->dbService->ejecutarConsulta($buscarNumDoc, [':postulacion_id' => $data['postulacion_idpostulaciones']]);
            if ($usuario) {
                $descripcionNotificacion = "Fuiste asignado a una entrevista el día " . $data['fecha'] .
                                           " a la hora " . $data['hora'] .
                                           " en " . $data['lugarMedio'];

                $sqlNoti = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, created_at, num_doc)
                            VALUES (?, ?, ?, ?, ?)";
                $this->dbService->ejecutarConsulta($sqlNoti, [
                    $descripcionNotificacion,
                    "Pendiente",
                    "entrevista",
                    date('Y-m-d H:i:s'),
                    $usuario[0]['usuario_num_doc']  
                ]);
            }

            return true;
        } catch (PDOException $e) {
            throw new \Exception('Error al asignar entrevista: ' . $e->getMessage(), 500);
        }
    }

    public function asistenciaConfirmada($identrevista): void {
        $sql = "UPDATE entrevista SET estadoEntrevista = 'Asistencia' WHERE identrevista = :identrevista";
        
        try {
            $this->dbService->ejecutarConsulta($sql, [':identrevista' => $identrevista]);
        } catch (PDOException $e) {
            throw new \Exception('Error al confirmar asistencia: ' . $e->getMessage(), 500);
        }
    }

    public function asistenciaNoConfirmada($identrevista): void {
        $sql = "UPDATE entrevista SET estadoEntrevista = 'No asistió' WHERE identrevista = :identrevista";

        try {
            $this->dbService->ejecutarConsulta($sql, [':identrevista' => $identrevista]);
        } catch (PDOException $e) {
            throw new \Exception('Error al marcar asistencia no confirmada: ' . $e->getMessage(), 500);
        }
    }

    public function rechazarEntrevistado($identrevista, $num_doc): void {
        $sql = "UPDATE entrevista SET estadoEntrevista = 'Rechazado' WHERE identrevista = :identrevista";

        try {
            $this->dbService->ejecutarConsulta($sql, [':identrevista' => $identrevista]);
            $this->notificacionDeEstadoDeEntrevistaAlAspirante($num_doc, 'Rechazado');

        } catch (PDOException $e) {
            throw new \Exception('Error al rechazar entrevistado: ' . $e->getMessage(), 500);
        }
    }

    public function notificacionDeEstadoDeEntrevistaAlAspirante($num_doc, $estado): void {
        $descripcionNotificacion = "El estado de tu entrevista ha cambiado a: " . $estado;
        $sql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, created_at, num_doc)
                VALUES (?, ?, ?, ?, ?)";

        try {
            $this->dbService->ejecutarConsulta($sql, [
                $descripcionNotificacion,
                "Activa",
                "PostulacionAspirantes",
                date('Y-m-d H:i:s'),
                $num_doc
            ]);
        } catch (PDOException $e) {
            throw new \Exception('Error al enviar notificación de estado de entrevista: ' . $e->getMessage(), 500);
        }
    }



}
