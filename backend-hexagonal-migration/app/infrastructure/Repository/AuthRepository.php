<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Infrastructure\Repository;

use Domain\Repository\AuthRepositoryInterface;
use Infrastructure\Persistence\DatabaseConnection;
use PDO;

class AuthRepository implements AuthRepositoryInterface {
    private PDO $db;

    public function __construct() {
        $this->db = DatabaseConnection::getConnection();
    }

    public function registrar(array $data): string {
        $stmt = $this->db->prepare("INSERT INTO usuarios (num_doc, password, estado, rol_idrol) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['num_doc'],
            $data['password'],
            $data['estado'],
            $data['rol_idrol']
        ]);
        return "Usuario registrado con éxito";
    }

    public function buscarUsuarioPorNumDoc(string $num_doc): ?array {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE num_doc = ?");
        $stmt->execute([$num_doc]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }
}
