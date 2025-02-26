<?php
require_once 'config/config.php';

class Aspirante {
    private $db;

    public function __construct($db) {
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

    public function obtenerPostulacionesAspirante($num_doc, $idconvocatoria) {
        try {
            $sql = "SELECT * FROM postulacion p INNER JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria WHERE p.usuario_num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
            $stmt->execute();
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($resultados) {
                return $resultados;
            }
            return null;
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return null;
        } 
    }

    public function verificarPostulacion($num_doc, $idconvocatoria) {
        try {
            $sql = 'SELECT * FROM postulacion WHERE usuario_num_doc = :num_doc AND convocatoria_idconvocatoria = :idconvocatoria';
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
            $stmt->bindParam(':idconvocatoria', $idconvocatoria, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($resultado) {
                return $resultado;
            }
            return null;
        } catch(PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return null;
        }
    }

    public function aplicacionDeAspirante($num_doc, $idconvocatoria) {
        try {
            $sql = "INSERT INTO postulacion (usuario_num_doc, convocatoria_idconvocatoria, estadoPostulacion) VALUES (?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$num_doc, $idconvocatoria, "En proceso"]);
    
            // Si la inserción es correcta se notifica al aspirante y a RRHH
            if ($stmt->rowCount() > 0) {
                // Notificación para el aspirante
                $descripcionNotificacion = 'Has aplicado a una convocatoria';
                $estadoNotificacion = 'No leida';
                $tipo = 'PostulacionAspirantes';


                $insert = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc)
                            VALUES  (? , ? , ? , ?)";
                $stmt = $this->db->prepare($insert);
                if (!$stmt->execute([$descripcionNotificacion, $estadoNotificacion, $tipo, $num_doc])) {
                    throw new PDOException("Error al insertar la notificación para el aspirante: " . implode(", ", $stmt->errorInfo()));
                }

                // Notificación para RRHH
                $descripcionNotificacion2 = "El aspirante con número de documento $num_doc ha aplicado a una convocatoria";
                $insert2 = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc)
                            VALUES (? , ? , ? , ?)";
                $stmt = $this->db->prepare($insert2);
                if (!$stmt->execute([$descripcionNotificacion2, $estadoNotificacion, $tipo, $num_doc])) {
                    throw new PDOException("Error al insertar la notificación para RRHH: " . implode(", ", $stmt->errorInfo()));
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
?>