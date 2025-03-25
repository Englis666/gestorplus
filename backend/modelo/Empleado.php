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

    
    
    public function obtenerMiPazYSalvo($vinculacion_idvinculacion){
        try{
            $sql = "SELECT * FROM pazysalvo WHERE vinculacion_idvinculacion = :vinculacion_idvinculacion";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':vinculacion_idvinculacion', $vinculacion_idvinculacion, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if($resultado){
                return $resultado;
            }
            return [];
        }catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function obtenerMisVacaciones($num_doc){
        try{
            $sql = "SELECT * FROM vacacion WHERE num_doc = :num_doc";
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
            $stmt->bindParam(':tipo', 'Queja', PDO::PARAM_STR);
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
            $sql = "INSERT INTO ausencia (fechaInicio, fechaFin, tipoAusencia, descripcion, fechaRegistro, usuario_num_doc) VALUES (?, ?, ?, ?, ?, ?)";
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
                    '1', 
                    'Ausencia', 
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
                    'Vacacion',
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