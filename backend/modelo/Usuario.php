<?php
namespace Modelo;
use PDO;
use PDOException;
use Config\Database;

class Usuario {

    private $db;
    
    public function __construct($db){
        $this->db = $db;
    }

    private function ejecutarConsulta($sql, $params = []){
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Ocurrió un error en la base de datos']);
            http_response_code(500);
            return [];
        }
    }

    // Obtener Recursos Humanos y Administradores
    public function obtenerRRHH() {
        $sql = "SELECT u.num_doc, u.nombres,u.apellidos, r.nombreRol FROM usuario AS u
                INNER JOIN rol AS r ON u.rol_idrol = r.idrol
                WHERE r.nombreRol = 'Recursos humanos' OR r.nombreRol = 'Administrador'";
        return $this->ejecutarConsulta($sql);
    }

    // Obtener todos los usuarios vinculados con postulaciones y cargos
    public function obtenerUsuarios() {
        $sql = "SELECT * FROM vinculacion as v
                INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc
                INNER JOIN postulacion as p ON u.num_doc = p.usuario_num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";
        return $this->ejecutarConsulta($sql);
    }

    // Otros métodos que puedes agregar según tu necesidad...
}
