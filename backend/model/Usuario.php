<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

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
        $sql = "SELECT * FROM vinculacion
                INNER JOIN usuario ON vinculacion.usuario_num_doc = usuario.num_doc
                WHERE estadoContrato = 'Activo'";
        return $this->dbService->ejecutarConsulta($sql);
    }

}
