<?php
namespace Model;

use Config\Database;
use PDO;
use PDOException;

class Postulacion {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function obtenerPostulacionesAspirante($num_doc) {
        try {
            $sql = "SELECT * FROM postulacion p 
                    INNER JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                    INNER JOIN cargo as ca ON c.cargo_idCargo = ca.idCargo
                    WHERE p.usuario_num_doc = :num_doc";
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

    public function obtenerPostulaciones() {
        try {
            $sql = "SELECT * FROM postulacion as p
                    INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                    INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                    INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($resultado) {
                return $resultado;
            }
            return [];
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
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
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return null;
        }
    }
    public function obtenerPostulacionesAgrupadasPorConvocatoria(int $idconvocatoria): array {
        try {
            $sql = "
                SELECT 
                    u.num_doc,
                    u.nombres,
                    u.email,
                    p.idpostulacion,
                    ca.nombreCargo AS cargo,
                    h.*
                FROM postulacion p
                INNER JOIN usuario u ON p.usuario_num_doc = u.num_doc
                INNER JOIN hojadevida h ON u.hojadevida_idHojadevida = h.idHojadevida
                INNER JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo ca ON c.cargo_idcargo = ca.idcargo
                WHERE c.idconvocatoria = :idconvocatoria
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':idconvocatoria', $idconvocatoria, PDO::PARAM_INT);
            $stmt->execute();
    
            // Retornar los resultados o un array vacío si no hay resultados
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            // Loguear el error (esto depende de tu configuración de logging)
            error_log('Error en la consulta: ' . $e->getMessage());
    
            // Enviar una respuesta de error
            echo json_encode(['error' => 'Error en la consulta, por favor intente nuevamente más tarde.']);
            http_response_code(500);
            return [];  // Retorna un array vacío en caso de error
        }
    }
    
    
}
