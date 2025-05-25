<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Migrations;
use PDO;
class RolMigration {

    private PDO $db;
    public function __construct() {
        $this->db = (new \Config\Database())->getConnection();
    }
    public function importarRoles($row) {
        try {
            [$idrol, $nombreRol, $estadoRol] = $row;

            $stmt = $this->db->prepare("INSERT INTO rol (idrol, nombreRol, estadoRol) VALUES (?, ?, ?)");
            $stmt->execute([$idrol, $nombreRol, $estadoRol]);

            echo "Rol insertado: $nombreRol\n";
        } catch (\Exception $e) {
            echo "Error al insertar rol: " . $e->getMessage() . "\n";
        }
    }
}
