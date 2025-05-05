<?php
declare(strict_types = 1);
namespace Model;

use Service\DatabaseService;
use PDOException;
use Exception;

class Permiso {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerTodosLosPermisos() {
        $sql = "SELECT * FROM permiso as p
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc";
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function obtenerPermisos($num_doc) { 
        try {
            $sql = "SELECT * FROM permiso as p
                    INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                    WHERE u.num_doc = :num_doc";
            return $this->dbService->ejecutarConsulta($sql, ['num_doc' => $num_doc]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];                                  
        }
    }

    public function solicitarPermiso($num_doc, $data) {
        try {
            $estado = 'Pendiente';

            $this->dbService->iniciarTransaccion();

            $sql = "INSERT INTO permiso (tipo, fechaInicio, fechaFin, estado, usuario_num_doc) 
                    VALUES (?, ?, ?, ?, ?)";
            $params = [
                $data['tipo'],
                $data['fechaInicio'],
                $data['fechaFin'],
                $estado,
                $num_doc
            ];
            $permisoId = $this->dbService->ejecutarInsert($sql, $params);

            if ($permisoId) {
                $descripcionNotificacion = "El empleado identificado con la cédula {$num_doc} ha solicitado un permiso de tipo {$data['tipo']}";

                $sql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                        VALUES (?, ?, ?, ?)";
                $params = [
                    $descripcionNotificacion,
                    'Pendiente',
                    'General',
                    $num_doc
                ];
                $this->dbService->ejecutarInsert($sql, $params);

                $this->dbService->confirmarTransaccion();

                return true;
            } else {
                $this->dbService->revertirTransaccion();
                return false;
            }
        } catch (Exception $e) {
            $this->dbService->revertirTransaccion(); 
            error_log($e->getMessage());
            return false;
        }
    }

    private function gestionarPermiso($idPermisos, $estadoPermiso, $descripcionNotificacion) {
        if (!is_array($idPermisos)) {
            $idPermisos = [$idPermisos];
        }

        foreach ($idPermisos as $idPermiso) {
            // Actualizar el estado del permiso
            $sql = "UPDATE permiso SET estado = ? WHERE idPermisos = ?";
            $params = [$estadoPermiso, $idPermiso];
            $this->dbService->ejecutarAccion($sql, $params);

            $buscar = "SELECT fechaInicio, fechaFin, usuario_num_doc FROM permiso WHERE idPermisos = ?";
            $permiso = $this->dbService->ejecutarConsulta($buscar, [$idPermiso], true);

            if ($permiso) {
                $fechaInicio = $permiso['fechaInicio'];
                $fechaFin = $permiso['fechaFin'];
                $num_doc = $permiso['usuario_num_doc'];

                $descripcion = str_replace(['{fechaInicio}', '{fechaFin}'], [$fechaInicio, $fechaFin], $descripcionNotificacion);
                $sql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                        VALUES (?, ?, ?, ?)";
                $params = [$descripcion, 'Activa', 'General', $num_doc];
                $this->dbService->ejecutarInsert($sql, $params);
            }
        }
    }

    public function permisoAceptado($idPermisos) {
        $descripcionNotificacion = "Tu permiso fue aprobado para el día {fechaInicio} hasta {fechaFin}";
        $this->gestionarPermiso($idPermisos, 'Aceptada', $descripcionNotificacion);
    }

    public function permisoRechazado($idPermisos) {
        $descripcionNotificacion = "Tu permiso fue rechazado para el día {fechaInicio} hasta {fechaFin}";
        $this->gestionarPermiso($idPermisos, 'Rechazada', $descripcionNotificacion);
    }
}
