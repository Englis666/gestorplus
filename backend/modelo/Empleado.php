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

    public function obtenerEmpleados() {
        $sql = "SELECT * FROM vinculacion as v
                INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc
                INNER JOIN postulacion as p ON u.num_doc = p.usuario_num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";
        return $this->ejecutarConsulta($sql);
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