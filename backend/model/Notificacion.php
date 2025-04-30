<?php
namespace Model;
use Config\Database;
use PDO;
use PDOException;

class Notificacion{
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



    public function obtenerTodasLasNotificaciones() {
        $sql = "SELECT * FROM notificacion";
        return $this->ejecutarConsulta($sql);
    }

    public function obtenerNotificaciones($num_doc){
        try{
            $sql = "SELECT * FROM notificacion WHERE num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
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

    public function obtenerNotificacionesAspirante($num_doc){
        try{
          $sql = "SELECT * FROM notificacion WHERE num_doc = :num_doc AND tipo = 'PostulacionAspirantes' OR tipo = 'entrevista'";
          $stmt = $this->db->prepare($sql);
          $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
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


    public function notificacionAceptada($idausencia) {
        // Actualizar ausencia
        $sql = "UPDATE ausencia SET justificada = 'Justificada' WHERE idausencia = :idausencia";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        $stmt->execute();
    
        // Obtener el num_doc del usuario
        $sqlObtenerNumDoc = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
        $stmtNumDoc = $this->db->prepare($sqlObtenerNumDoc);
        $stmtNumDoc->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        $stmtNumDoc->execute();
        $numDoc = $stmtNumDoc->fetchColumn(); // Extraer el valor
    
        if ($stmt->execute()) {
            $descripcionNotificacion = "Ausencia aceptada";
            $tipo = "Aceptacion";
    
            // Insertar la notificación con num_doc
            $insertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, tipo, num_doc) VALUES (?, ?, ?)";
            $stmtNotificacion = $this->db->prepare($insertarNotificacion);
            $stmtNotificacion->bindParam(1, $descripcionNotificacion, PDO::PARAM_STR);
            $stmtNotificacion->bindParam(2, $tipo, PDO::PARAM_STR);
            $stmtNotificacion->bindParam(3, $numDoc, PDO::PARAM_STR); // Agregar num_doc
            $stmtNotificacion->execute();
    
            if ($stmtNotificacion->execute()){ 
                $lastId = $this->db->lastInsertId();
                $insertarTablaRelacional = "INSERT INTO ausencia_has_notificacion (notificacion_idnotificacion, ausencia_idausencia) VALUES (?, ?)";
                $stmtRelacional = $this->db->prepare($insertarTablaRelacional);
                $stmtRelacional->bindParam(1, $lastId, PDO::PARAM_INT);
                $stmtRelacional->bindParam(2, $idausencia, PDO::PARAM_INT);
                $stmtRelacional->execute();
                return true;
            }
        } else {
            return false;
        }
    }

    public function notificacionRechazada($idausencia) {
        // Actualizar ausencia
        $sql = "UPDATE ausencia SET justificada = 'Rechazada' WHERE idausencia = :idausencia";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        $stmt->execute();

        // Obtener el num_doc del usuario
        $sqlObtenerNumDoc = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
        $stmtNumDoc = $this->db->prepare($sqlObtenerNumDoc);
        $stmtNumDoc->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        $stmtNumDoc->execute();
        $numDoc = $stmtNumDoc->fetchColumn(); // Extraer el valor

        if ($stmt->execute()) {
            $descripcionNotificacion = "Ausencia rechazada";
            $tipo = "Rechazo";

            // Insertar la notificación con num_doc
            $insertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, tipo, num_doc) VALUES (?, ?, ?)";
            $stmtNotificacion = $this->db->prepare($insertarNotificacion);
            $stmtNotificacion->bindParam(1, $descripcionNotificacion, PDO::PARAM_STR);
            $stmtNotificacion->bindParam(2, $tipo, PDO::PARAM_STR);
            $stmtNotificacion->bindParam(3, $numDoc, PDO::PARAM_STR); // Agregar num_doc
            $stmtNotificacion->execute();

            if ($stmtNotificacion->execute()){ 
                $lastId = $this->db->lastInsertId();
                $insertarTablaRelacional = "INSERT INTO ausencia_has_notificacion (notificacion_idnotificacion, ausencia_idausencia) VALUES (?, ?)";
                $stmtRelacional = $this->db->prepare($insertarTablaRelacional);
                $stmtRelacional->bindParam(1, $lastId, PDO::PARAM_INT);
                $stmtRelacional->bindParam(2, $idausencia, PDO::PARAM_INT);
                $stmtRelacional->execute();
                return true;
            }

        } else {
            return false;
        }
    }





}