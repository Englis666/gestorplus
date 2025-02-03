<?php
// MODELO
require_once 'config/config.php';

class Administrador {

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function obtenerTodasLasNotificaciones(){
        try{
            $sql = "SELECT * FROM notificacion";
            $stmt = $this->db->prepare($sql);
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
    public function obtenerConvocatorias(){
        $sql = "SELECT * FROM convocatoria";
        $stmt = $this->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
    
    }


    public function obtenerTodasLasJornadas(){
        try{
            $sql = "SELECT * FROM jornada as j
                    INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc
                    ";
            $stmt = $this->db->prepare($sql);
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

    public function obtenerTodasLasAusencias(){
        try{
            $sql = "SELECT * FROM ausencia";
            $stmt = $this->db->prepare($sql);
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

    public function obtenerUsuarios(){
        $sql = "SELECT * FROM usuario as u
                INNER JOIN rol as r ON u.rol_idrol = idrol
                WHERE r.nombreRol = 'Empleados'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

    public function obtenerEntrevistas(){
        $sql = "SELECT * FROM entrevista as e 
                INNER JOIN postulacion as p ON e.postulacion_idpostulaciones =  idpostulacion
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }


    public function corroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 1 WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }
    public function noCorroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 0 WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }

    public function notificacionAceptada($idausencia){
        $sql = "UPDATE ausencia SET justificada = 1 WHERE idausencia = :idausencia";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $descripcionNotificacion = "Ausencia aceptada";
            $tipo = "Aceptacion";
            $insertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, tipo) VALUES (?, ?)";
            $stmt = $this->db->prepare($insertarNotificacion);
            $stmt->bindParam(1, $descripcionNotificacion, PDO::PARAM_STR);
            $stmt->bindParam(2, $tipo, PDO::PARAM_STR);
            $stmt->execute();
            
            return true; 
        } else {
            return false;
        }
    }
    
    public function notificacionRechazada($idausencia){
        $sql = "UPDATE ausencia SET justificada = 0 WHERE idausencia = :idausencia";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $descripcionNotificacion = "Ausencia rechazada";
            $tipo = "Rechazo";
            $insertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, tipo) VALUES (?, ?)";
            $stmt = $this->db->prepare($insertarNotificacion);
            $stmt->bindParam(1, $descripcionNotificacion, PDO::PARAM_STR);
            $stmt->bindParam(2, $tipo, PDO::PARAM_STR);
            $stmt->execute();
            
            return true; 
        } else {
            return false; 
        }
    }
    
     public function agregarConvocatoria($data){
        $sql = "INSERT INTO convocatoria (nombreConvocatoria,descripcion,requisitos, salario, cantidadConvocatoria)
                                             VALUES ( ? , ? , ? , ? , ?)";
         $stmt = $this->db->prepare($sql);
         $stmt->execute([
             $data['nombreConvocatoria'],
             $data['descripcion'],
             $data['requisitos'],
             $data['salario'],
             $data['cantidadConvocatoria'],
         ]);
         $this->db->commit();
                
     }


}



?>