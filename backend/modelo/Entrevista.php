<?php
namespace Modelo;

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
        $sql = "INSERT INTO entrevista (fecha,hora,lugarMedio,postulacion_idpostulaciones, estadoEntrevista)
                                        VALUES(? , ? , ? , ? , ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['fecha'],
            $data['hora'],
            $data['lugarMedio'],
            $data['postulacion_idpostulaciones'],
            $estado
        ]);
        return;
   }



}