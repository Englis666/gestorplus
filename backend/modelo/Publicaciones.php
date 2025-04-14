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
    

}