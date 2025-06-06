<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Migrations;

require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenvPath = __DIR__ . '/../';
if (file_exists($dotenvPath . '.env')) {
    $dotenv = Dotenv::createImmutable($dotenvPath); 
    $dotenv->load();
}
use PDO;

class AdminCreate {
    private PDO $db;

    public function __construct() {
        $this->db = (new \Config\Database())->getConnection();
    }

    public function crearAdministrador() {
        try {
            $num_doc = 898989;
            $email = "Administrador@gmail.com";

            $verificar = $this->db->prepare("SELECT num_doc FROM usuario WHERE num_doc = ? OR email = ?");
            $verificar->execute([$num_doc, $email]);

            if ($verificar->fetch()) {
                echo "⚠️ Ya existe un administrador con el documento o email especificado.\n";
                return;
            }

            $insertarHojaDeVida = $this->db->prepare("INSERT INTO hojadevida () VALUES ()");
            $insertarHojaDeVida->execute();
            $idHojadevida = $this->db->lastInsertId();

            if (!$idHojadevida) {
                echo "No se pudo registrar la hoja de vida del administrador. Revisa el script CrearAdministrador.php\n";
                return;
            }

            $nombres = "Administrador";
            $apellidos = "Juan";
            $tipodDoc = "Cedula";
            $password = password_hash('123456789', PASSWORD_BCRYPT);
            $estado = 1;
            $idRol = 1;

            $stmt = $this->db->prepare("
                INSERT INTO usuario (num_doc, nombres, apellidos, email, tipodDoc, password, estado, hojadevida_idHojadevida, rol_idrol)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $num_doc,
                $nombres,
                $apellidos,
                $email,
                $tipodDoc,
                $password,
                $estado,
                $idHojadevida,
                $idRol
            ]);

            echo "✅ Administrador creado exitosamente.\n";

        } catch (\Exception $e) {
            echo "❌ Error al insertar el usuario administrador. Soporte: " . $e->getMessage() . "\n";
        }
    }
}

require_once __DIR__ . '/../config/Database.php';
(new AdminCreate())->crearAdministrador();