<?php
namespace Model;

use Config\Database;
use PDO;
use PDOException;

class Entrevista{
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
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function obtenerEntrevistas() {
        $sql = "SELECT * FROM entrevista as e 
                INNER JOIN postulacion as p ON e.postulacion_idpostulaciones = p.idpostulacion
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria";
        return $this->ejecutarConsulta($sql);
    }

    public function obtenerDatosDelEntrevistado($num_doc) {
        $sqlDatos = "SELECT 
                        *
                     FROM postulacion AS p
                     INNER JOIN entrevista AS e ON p.idpostulacion = e.postulacion_idpostulaciones
                     INNER JOIN usuario AS u ON p.usuario_num_doc = u.num_doc
                     INNER JOIN hojadevida AS h ON u.hojadevida_idHojadevida = h.idHojadevida
                     WHERE u.num_doc = :num_doc";
        $datos = $this->ejecutarConsulta($sqlDatos, [':num_doc' => $num_doc]);
        if (!$datos) return null;
    
        $datos = $datos[0];
    
        $sqlEstudios = "SELECT * FROM estudio WHERE hojadevida_idHojadevida = :idHojadevida";
        $estudios = $this->ejecutarConsulta($sqlEstudios, [':idHojadevida' => $datos['idHojadevida']]);
    
        // Experiencia laboral
        $sqlExperiencia = "SELECT * FROM experiencialaboral WHERE hojadevida_idHojadevida = :idHojadevida";
        $experiencias = $this->ejecutarConsulta($sqlExperiencia, [':idHojadevida' => $datos['idHojadevida']]);
    
        // Armar estructura final
        $datos['estudios'] = $estudios ?: [];
        $datos['experiencias'] = $experiencias ?: [];
    
        return $datos;
    }

    
    public function asignarEntrevista($data){
        $estado = "Pendiente";
    
        // Insertar entrevista
        $sql = "INSERT INTO entrevista (fecha, hora, lugarMedio, postulacion_idpostulaciones, estadoEntrevista)
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['fecha'],
            $data['hora'],
            $data['lugarMedio'],
            $data['postulacion_idpostulaciones'],
            $estado
        ]);
    
        // Verificar que la entrevista fue insertada
        if ($stmt->rowCount() > 0) {
    
            // Buscar el número de documento del usuario que hizo la postulación
            $buscarNumDoc = "SELECT usuario_num_doc FROM postulacion WHERE idpostulacion = :postulacion_id";
            $stmtBuscar = $this->db->prepare($buscarNumDoc);
            $stmtBuscar->execute([':postulacion_id' => $data['postulacion_idpostulaciones']]);
            $usuario = $stmtBuscar->fetch(PDO::FETCH_ASSOC);
    
            if ($usuario) {
                $descripcionNotificacion = "Fuiste asignado a una entrevista el día " . $data['fecha'] .
                                           " a la hora " . $data['hora'] .
                                           " en " . $data['lugarMedio'];
    
                // Insertar notificación
                $sqlNoti = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, created_at, num_doc)
                            VALUES (?, ?, ?, ?, ?)";
                $stmtNoti = $this->db->prepare($sqlNoti);
                $stmtNoti->execute([
                    $descripcionNotificacion,
                    "Pendiente",
                    "entrevista",
                    date('Y-m-d H:i:s'),
                    $usuario['usuario_num_doc']
                ]);
            }
        }
    
        return true;
    }
    

   public function asistenciaConfirmada($identrevista){
    $sql = "UPDATE entrevista SET estadoEntrevista = 'Asistencia' WHERE identrevista = :identrevista";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':identrevista', $identrevista, PDO::PARAM_INT);
    $stmt->execute();
}

public function asistenciaNoConfirmada($identrevista){
    $sql = "UPDATE entrevista SET estadoEntrevista = 'No asistió' WHERE identrevista = :identrevista";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(":identrevista", $identrevista, PDO::PARAM_INT);
    $stmt->execute();
}



}