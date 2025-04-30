<?php
namespace Model;

use Config\Database;
use PDO;
use PDOException;

class Ausencia{
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    private function ejecutarConsulta($sql, $params = []) {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Ocurrió un error en la base de datos']);
            http_response_code(500);
            return [];
        }
    }


    public function obtenerAusencias($num_doc){
        try{
           $sql = "SELECT * FROM ausencia WHERE usuario_num_doc = :num_doc";
           $stmt = $this->db->prepare($sql);
           $stmt->bindParam(':num_doc' , $num_doc , PDO::PARAM_STR);
           $stmt->execute();
           $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
           if($resultado){
               return $resultado;
           }
        }catch (PDOException $e) {
           echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
           http_response_code(500);
           return [];
           }
       }

    public function obtenerTodasLasAusencias() {
        $sql = "SELECT * FROM ausencia WHERE NOT justificada = 'Justificada'";
        return $this->ejecutarConsulta($sql);
    }


    public function ausenciaAceptada(int $idausencia): bool {
            try {
            // Obtenemos el usuario_num_doc de la ausencia
            $sql = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($resultado) {
                $usuario_num_doc = $resultado['usuario_num_doc'];
    
                // Actualizar el estado de la ausencia a 'Justificada'
                $updateSql = "UPDATE ausencia SET justificada = 'Justificada' WHERE idausencia = :idausencia";
                $updateStmt = $this->db->prepare($updateSql);
                $updateStmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
                $updateStmt->execute();
    
                // Insertar la notificación para el usuario
                $descripcionNotificacion = "Tu solicitud de ausencia ha sido aceptada.";
                $notificationSql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                    VALUES (?, 'No leída', 'General', ?)";
                $notificationStmt = $this->db->prepare($notificationSql);
                $notificationStmt->execute([$descripcionNotificacion, $usuario_num_doc]);
    
                return true;
            }
    
            return false;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return false;
        }
    }

    public function ausenciaRechazada($idausencia) {
        try {
            // Obtenemos el usuario_num_doc de la ausencia
            $sql = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($resultado) {
                $usuario_num_doc = $resultado['usuario_num_doc'];
    
                // Actualizar el estado de la ausencia a 'Rechazada'
                $updateSql = "UPDATE ausencia SET justificada = 'Rechazada' WHERE idausencia = :idausencia";
                $updateStmt = $this->db->prepare($updateSql);
                $updateStmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
                $updateStmt->execute();
    
                // Verificar si la actualización fue exitosa
                if ($updateStmt->rowCount() > 0) {
                    // Insertar la notificación para el usuario
                    $descripcionNotificacion = "Tu solicitud de ausencia ha sido rechazada.";
                    $notificationSql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                        VALUES (?, 'No leída', 'General', ?)";
                    $notificationStmt = $this->db->prepare($notificationSql);
                    $notificationStmt->execute([$descripcionNotificacion, $usuario_num_doc]);
    
                    // Verificar si la notificación fue insertada
                    if ($notificationStmt->rowCount() > 0) {
                        return true;
                    } else {
                        echo "Error al insertar la notificación.";
                    }
                } else {
                    echo "No se actualizó la ausencia.";
                }
            }
    
            return false;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return false;
        }
    }
    


    public function solicitarAusencia($num_doc, $data) {
        try {
            $sql = "INSERT INTO ausencia (fechaInicio, fechaFin, tipoAusencia, descripcion, fechaRegistro, justificada, usuario_num_doc) VALUES (?, ?, ?, ?, ?, 'En proceso', ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['fechaInicio'],
                $data['fechaFin'],
                $data['tipoAusencia'],
                $data['descripcion'],
                date('Y-m-d H:i:s'),
                $num_doc
            ]);
    
            if ($stmt->rowCount() > 0) {
                $descripcionNotificacion = "El empleado identificado con la cedula $num_doc ha solicitado una ausencia para el dia " . $data['fechaInicio'] . " hasta el dia " . $data['fechaFin'];
    
            
                $notificationSql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) VALUES (?, ?, ?, ?)";
                $notificationStmt = $this->db->prepare($notificationSql);
                $notificationStmt->execute([
                    $descripcionNotificacion,
                    'No leida', 
                    'General', 
                    $num_doc
                ]);
    
                return true; 
            } else {
                return false; 
            }
        } catch (Exception $e) {
            error_log($e->getMessage());
            return false; 
        }
    }
    


}