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


   public function desactivarRol(int $idrol): bool {
        $sql = "UPDATE rol SET estado = 'inactivo' WHERE idrol = :idrol";
        $params = [':idrol' => $idrol];
        return $this->dbService->ejecutarAccion($sql, $params);
    }

    public function activarRol(int $idrol): bool {
        $sql = "UPDATE rol SET estado = 'activo' WHERE idrol = :idrol";
        $params = [':idrol' => $idrol];
        return $this->dbService->ejecutarAccion($sql, $params);
    }
}