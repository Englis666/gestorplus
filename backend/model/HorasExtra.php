<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types = 1);
namespace Model;

use Service\DatabaseService;
use PDO;
use PDOException;

class HorasExtra {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerTodasLasHorasExtra() {
        $sql = "SELECT h.*, u.nombres, u.apellidos, u.num_doc, r.nombreRol
                FROM horaextra as h
                JOIN usuario as u ON h.usuario_num_doc = u.num_doc
                LEFT JOIN vinculacion as v ON u.num_doc = v.usuario_num_doc
                LEFT JOIN rol as r ON u.rol_idrol = r.idrol";
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function obtenerMisHorasExtra(int $num_doc){
        $sql = "SELECT * FROM horasextra WHERE num_doc = :num_doc";
        return $this->dbService->ejecutarConsulta($sql, [':num_doc' => $num_doc]);
    }

}
