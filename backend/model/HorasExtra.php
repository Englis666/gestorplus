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
        $sql = "SELECT * FROM horaextra";
        return $this->dbService->ejecutarConsulta($sql);
    }
}
