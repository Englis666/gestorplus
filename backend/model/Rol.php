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


   public function desactivarRol(int $idRol): bool {
        $sql = "UPDATE rol SET estadoRol = 'inactivo' WHERE idrol = :idrol";
        $params = [':idrol' => $idRol];
        return $this->dbService->ejecutarAccion($sql, $params);
    }

    public function activarRol(int $idRol): bool {
        $sql = "UPDATE rol SET estadoRol = 'activo' WHERE idrol = :idrol";
        $params = [':idrol' => $idRol];
        return $this->dbService->ejecutarAccion($sql, $params);
    }
}