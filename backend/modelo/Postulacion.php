<?php
namespace Modelo;

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
                    ca.nombreCargo AS cargo
                FROM postulacion p
                INNER JOIN usuario u ON p.usuario_num_doc = u.num_doc
                INNER JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo ca ON c.cargo_idcargo = ca.idcargo
                WHERE c.idconvocatoria = :idconvocatoria
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':idconvocatoria', $idconvocatoria, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    /**
     * Obtiene la hoja de vida completa (hojadevida + estudios + experiencia)
     */
    public function obtenerHojaDeVidaCompleta(string $num_doc): array {
        try {
            $sql = "
                SELECT 
                    h.idHojadevida,
                    h.fechaNacimiento, h.direccion, h.ciudad, h.ciudadNacimiento,
                    h.telefono, h.telefonoFijo, h.estadohojadevida,
                    h.estadoCivil, h.genero, h.nivelEducativo, h.fotoPerfil,
                    h.skills, h.portafolio,
                    e.idestudio, e.nivelEstudio, e.areaEstudio, e.estadoEstudio,
                    e.fechaInicioEstudio, e.fechaFinEstudio, e.tituloEstudio,
                    e.institucionEstudio, e.ubicacionEstudio, e.modalidad,
                    e.paisInstitucion, e.duracionEstudio, e.materiasDestacadas,
                    ex.idexperienciaLaboral, ex.profesion, ex.descripcionPerfil,
                    ex.fechaInicioExp, ex.fechaFinExp, ex.empresa, ex.ubicacionEmpresa,
                    ex.tipoContrato, ex.salario, ex.logros, ex.referenciasLaborales
                FROM usuario u
                INNER JOIN hojadevida h ON u.hojadevida_idHojadevida = h.idHojadevida
                LEFT JOIN estudio e ON h.idHojadevida = e.hojadevida_idHojadevida
                LEFT JOIN experiencialaboral ex ON h.idHojadevida = ex.hojadevida_idHojadevida
                WHERE u.num_doc = :numDoc
            ";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':numDoc', $num_doc, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }
}
