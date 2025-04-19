<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Postulacion{
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function obtenerPostulacionesAspirante($num_doc) {
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

    public function obtenerPostulaciones(){
        $sql = "SELECT * FROM postulacion as p
                INNER JOIN usuario as u. ON p.usuario_num_doc = u.num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo
                ";
        $sql = "SELECT * FROM usuario as u
                INNER JOIN postulacion as p ON u.num_doc = p.usuario_num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
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


}