<?php
namespace Modelo;
use PDO;
use PDOException;

class Publicaciones {
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function obtenerPublicacionPorTipoDeContrato($num_doc) {
        // Construimos la consulta que:
        // 1. Selecciona solo las publicaciones activas.
        // 2. Devuelve aquellas publicaciones que sean generales (tipo_contrato = 'todos')
        //    o cuyo tipo de contrato coincida con el registrado en vinculacion para el usuario.
        $sql = "
            SELECT p.*
            FROM publicacion p
            WHERE p.estado = 'activo'
              AND (
                p.tipo_contrato = 'todos'
                OR p.tipo_contrato IN (
                    SELECT v.tipoContrato
                    FROM vinculacion v
                    WHERE v.usuario_num_doc = :num_doc
                )
              )
            ORDER BY p.fechaPublicacion DESC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregarPublicacion($data, $num_doc) {
        $sql = "
            INSERT INTO publicacion (titulo, descripcion, imagen, fechaPublicacion, usuario_num_doc, tipo_contrato, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
        // Preparamos la consulta
        $stmt = $this->db->prepare($sql);
    
        // Vinculamos los parámetros
        $stmt->bindParam(1, $data['titulo'], PDO::PARAM_STR);
        $stmt->bindParam(2, $data['descripcion'], PDO::PARAM_STR);
        $stmt->bindParam(3, $data['imagen'], PDO::PARAM_STR);
        $stmt->bindParam(4, $data['fechaPublicacion'], PDO::PARAM_STR); 
        $stmt->bindParam(5, $data['usuario_num_doc'], PDO::PARAM_INT);
        $stmt->bindParam(6, $data['tipo_contrato'], PDO::PARAM_STR);
        $stmt->bindParam(7, $data['estado'], PDO::PARAM_STR); 
    
        // Ejecutamos la consulta
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
    
    public function actualizarPublicacion($data) {
        $sql = "
            UPDATE publicacion
            SET titulo = ?, descripcion = ?, imagen = ?, fechaPublicacion = ?, tipo_contrato = ?, estado = ?
            WHERE idPublicacion = ?
        ";
    
        $stmt = $this->db->prepare($sql);
    
        $stmt->bindParam(1, $data['titulo'], PDO::PARAM_STR);
        $stmt->bindParam(2, $data['descripcion'], PDO::PARAM_STR);
        $stmt->bindParam(3, $data['imagen'], PDO::PARAM_STR);
        $stmt->bindParam(4, $data['fechaPublicacion'], PDO::PARAM_STR); 
        $stmt->bindParam(5, $data['tipo_contrato'], PDO::PARAM_STR);
        $stmt->bindParam(6, $data['estado'], PDO::PARAM_STR);
        $stmt->bindParam(7, $data['idPublicacion'], PDO::PARAM_INT); 
    
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
    
    public function eliminarPublicacion($idPublicacion) {
        if (empty($idPublicacion) || !is_numeric($idPublicacion)) {
            return false;
        }

        $sql = "DELETE FROM publicacion WHERE idPublicacion = :idPublicacion";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':idPublicacion', $idPublicacion, PDO::PARAM_INT);
            if ($stmt->execute()) {
                if ($stmt->rowCount() > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (PDOException $e) {
            error_log("Error al eliminar la publicación: " . $e->getMessage());
            return false;
        }
    }

}