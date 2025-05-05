<?php
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

            $stmt = $this->db->prepare("INSERT INTO usuario 
                (num_doc, nombres, apellidos, email, tipodDoc, password, estado, hojadevida_idHojadevida, rol_idrol) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $num_doc, $nombres, $apellidos, $email, $tipodDoc, $password, $estado, $idhojadevida, $idrol
            ]);

            echo "Usuario insertado: $nombres $apellidos\n";
        } catch (\Exception $e) {
            echo "Error al insertar usuario: " . $e->getMessage() . "\n";
        }
    }
}