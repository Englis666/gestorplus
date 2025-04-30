<?php
namespace Model;

use PDO;
use PDOException;

class Archivo {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function subirContrato($idVinculacion, $rutaArchivo, $num_doc) {
        try {
            $this->db->beginTransaction();

            $query = "UPDATE vinculacion SET documentoContrato = :ruta WHERE idvinculacion = :idVinculacion";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":ruta", $rutaArchivo, PDO::PARAM_STR);
            $stmt->bindParam(":idVinculacion", $idVinculacion, PDO::PARAM_INT);
            $stmt->execute();

            $updateRolQuery = "UPDATE usuario SET rol_idrol = :nuevoRol WHERE num_doc = :num_doc";
            $stmt = $this->db->prepare($updateRolQuery);
            $nuevoRol = 3;
            $stmt->bindParam(":nuevoRol", $nuevoRol, PDO::PARAM_INT);
            $stmt->bindParam(":num_doc", $num_doc, PDO::PARAM_INT);
            $stmt->execute();

            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            $this->db->rollBack();
            return false;
        }
    }

    public function obtenerContrato($num_doc) {
        try {
            $stmt = $this->db->prepare("SELECT documentoContrato FROM vinculacion WHERE usuario_num_doc = :num_doc");
            $stmt->bindParam(":num_doc", $num_doc, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            return null;
        }
    }
}
?>
