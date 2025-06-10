<?php

namespace Model;
use Service\DatabaseService;
use PDO;
use PDOException;

class Rol{
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    /**
     *
     * @return array
     */
    public function obtenerRoles() {
        $sql = "SELECT * FROM rol";
        return $this->dbService->ejecutarConsulta($sql);
    }
}