<?php
namespace Modelo;

use Config\Database;

use PDO;
use PDOException;

class Empleado {

    private $db;
    public function __construct($db){
        $this->db = $db;
    }
    
    public function obtenerMiPazYSalvo($num_doc) {
        try {
            $sql = "SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc";
            $stmtVinculacion = $this->db->prepare($sql);
            $stmtVinculacion->bindParam(':num_doc', $num_doc, PDO::PARAM_STR); 
            $stmtVinculacion->execute();
    
            $vinculacion = $stmtVinculacion->fetch(PDO::FETCH_ASSOC);
    
            if ($vinculacion) {
                $sql = "SELECT * FROM pazysalvo WHERE vinculacion_idvinculacion = :vinculacion_idvinculacion";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':vinculacion_idvinculacion', $vinculacion_idvinculacion, PDO::PARAM_INT);
                $stmt->execute();
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                return $resultado ? $resultado : [];
            }
    
            return []; 
    
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }
    

    public function obtenerPermisos($num_doc){ 
        try{
            $sql = "SELECT * FROM permiso as p
                    INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                    WHERE u.num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":num_doc" , $num_doc, PDO::PARAM_INT);
            $stmt->execute();

            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if($resultado){
                return $resultado;
            }
            return [];
        } catch (PDOException $e){
            echo json_encode(['error' => 'error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];                                  
        }
    }

    public function obtenerMisVacaciones($num_doc){
        try{
            $sql = "SELECT * FROM vacacion WHERE usuario_num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":num_doc" , $num_doc, PDO::PARAM_INT);
            $stmt->execute();
            
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if($resultado){
                return $resultado;
            }
            return[];
        }catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    
    public function obtenerJornadas($num_doc){
        try{
            $sql = "SELECT * FROM jornada as j
                    INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc
                    WHERE u.num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_STR);  
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
    public function finalizarJornada($num_doc){
        date_default_timezone_set('America/Bogota');
        $fecha = date('Y-m-d');
        $horaSalida = date('H:i:s');
    
        $sql = "UPDATE jornada 
                SET horaSalida = ?, estadoJornada = 'Finalizada' 
                WHERE usuario_num_doc = ? AND fecha = ? AND horaSalida IS NULL";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$horaSalida, $num_doc, $fecha]);
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

    public function solicitarQueja($num_doc,$data){
        try{
            $descripcionNotificacion = 'El usuario identificado con el número de documento '.$num_doc.' ha realizado una queja relacionada con la jornada ' . $data['fecha'];

            $sql = "INSERT INTO notificacion (descripcionNotificacion,estadoNotificacion,tipo,num_doc) VALUES (:descripcionNotificacion,:estadoNotificacion,:tipo,:num_doc)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':descripcionNotificacion', $descripcionNotificacion, PDO::PARAM_STR);
            $stmt->bindParam(':estadoNotificacion', 'Pendiente', PDO::PARAM_STR);
            $stmt->bindParam(':tipo', 'General', PDO::PARAM_STR);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_STR);
            $stmt->execute();
            $id = $this->db->lastInsertId();
            if($id){
                return $id;
            }
            return 0;
        }catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return 0;
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

    public function solicitarVacaciones($num_doc, $data){
        try{
            $estado = 'Pendiente';
            $sql = "INSERT INTO vacacion (fechaInicio, fechaFin,estadoVacacion, usuario_num_doc) VALUES (? , ? , ? , ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['fechaInicio'],
                $data['fechaFin'],
                $estado,
                $num_doc
            ]);
        
            if($stmt->rowCount() > 0 ){
                $descripcionNotificacion = "El empleado identificado con la cedula $num_doc ha solicitado una vacacion";
                $sql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) VALUES ( ? , ? , ? , ? )";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([
                    $descripcionNotificacion,
                    'Pendiente',
                    'General ',
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

    public function solicitarPermiso($num_doc, $data) {
        try {
            $estado = 'Pendiente';
    
            $sql = "INSERT INTO permiso (tipo, fechaInicio, fechaFin, estado, usuario_num_doc) VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['tipo'],
                $data['fechaInicio'],
                $data['fechaFin'],
                $estado,
                $num_doc
            ]);
    
            if ($stmt->rowCount() > 0) {
                $descripcionNotificacion = "El empleado identificado con la cédula {$num_doc} ha solicitado un permiso de tipo {$data['tipo']}";
    
                $sql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) VALUES (?, ?, ?, ?)";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([
                    $descripcionNotificacion,
                    'Pendiente',
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
?>