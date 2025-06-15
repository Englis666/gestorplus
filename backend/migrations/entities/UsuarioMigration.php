<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Migrations;
use PDO;
class UsuarioMigration {

    private PDO $db;
    public function __construct() {
        $this->db = (new \Config\Database())->getConnection();
    }
    public function importarUsuario($row) {
        try {
            [$num_doc, $nombres, $apellidos, $email, $tipodDoc, $password, $estado, $idhojadevida, $idrol] = $row;

            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            $maxId = $this->db->query("SELECT MAX(num_doc) as max_id FROM usuario")->fetch()['max_id'];
            if ($num_doc <= $maxId){
                $num_doc = $maxId + 1;
            }

            $stmt = $this->db->prepare("INSERT INTO usuario 
                (num_doc, nombres, apellidos, email, tipodDoc, password, estado, hojadevida_idHojadevida, rol_idrol) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $num_doc, $nombres, $apellidos, $email, $tipodDoc, $hashedPassword, $estado, $idhojadevida, $idrol
            ]);

            echo "Usuario insertado: $nombres $apellidos\n";
        } catch (\Exception $e) {
            echo "Error al insertar usuario: " . $e->getMessage() . "\n";
        }
    }
}
