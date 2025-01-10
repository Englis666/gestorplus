<?php
// MODELO
require_once 'config/config.php';

class Aspirante {

    private $db;

    public function __construct($db){
        $this->db = $db;
    }


    public function obtenerDetalleConvocatoria($idconvocatoria) {
        try {
            $sql = "SELECT * FROM convocatoria WHERE idconvocatoria = :idconvocatoria LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':idconvocatoria', $idconvocatoria, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($resultado) {
                return $resultado;
            }
            return null;
        } catch (PDOException $e) {
        echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
        http_response_code(500);
        return null;
        }
    }


    public function aplicacionDeAspirante($num_doc, $idconvocatoria) {
        try {
            $sql = "INSERT INTO postulacion (usuario_num_doc, convocatoria_idconvocatoria) VALUES (?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$num_doc, $idconvocatoria]);
    
            if ($stmt->rowCount() > 0) {

                //CLASE DE NOTIFICACION  
                $notificaciones = new Notificaciones($this->db);
                
                // Notificación para el aspirante
                $descripcionNotificacion = 'Has aplicado a una convocatoria';
                $estadoNotificacion = 'No leida';
                $tipo = 'Postulacion';
                $notificaciones->crearNotificacion($descripcionNotificacion, $estadoNotificacion, $tipo, $num_doc);
    
                // Notificación para RRHH
                $descripcionParaRRHH = "El aspirante con número de documento $num_doc ha aplicado a una convocatoria";
                $notificaciones->crearNotificacionRRHH($descripcionParaRRHH, $estadoNotificacion, $tipo, $num_doc);
            }
    
            return null;
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return null;
        }
    }
    
    
    
    
}

class Notificaciones {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function crearNotificacion($descripcion, $estado, $tipo, $num_doc) {
        try {
            $sql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                    VALUES (?, ?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$descripcion, $estado, $tipo, $num_doc]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error al insertar la notificación: ' . $e->getMessage()]);
            http_response_code(500);
        }
    }

    public function crearNotificacionRRHH($descripcion, $estado, $tipo, $num_doc) {
        try {
            $sql = "INSERT INTO notificacion (descripcionParaRRHH, estadoNotificacion, tipo, num_doc) 
                    VALUES (?, ?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$descripcion, $estado, $tipo, $num_doc]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error al insertar la notificación para RRHH: ' . $e->getMessage()]);
            http_response_code(500);
        }
    }
}


?>
