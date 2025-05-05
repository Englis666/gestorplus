<?php
namespace Model;
use Service\DatabaseService;
use PDO;
use PDOException;

class Usuario {
    private DatabaseService $dbService;    
    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    public function obtenerRRHH() {
        $sql = "SELECT u.num_doc, u.nombres,u.apellidos, r.nombreRol FROM usuario AS u
                INNER JOIN rol AS r ON u.rol_idrol = r.idrol
                WHERE r.nombreRol = 'Recursos humanos' OR r.nombreRol = 'Administrador'";
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function obtenerUsuarios() {
        $sql = "SELECT * FROM vinculacion as v
                INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc
                INNER JOIN postulacion as p ON u.num_doc = p.usuario_num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";
        return $this->dbService->ejecutarConsulta($sql);
    }

}
