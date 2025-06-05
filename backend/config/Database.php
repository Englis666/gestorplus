<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
namespace Config;

use PDO;
use PDOException;

class Database {
    private PDO $connection;

    public function __construct() {
        $host = $_ENV['DB_HOST'] ?? 'gestorplus-db';
        $dbname = $_ENV['DB_NAME'] ?? 'gestorplus';
        $port = $_ENV['DB_PORT'] ?? '';
        $user = $_ENV['DB_USER'] ?? '';
        $pass = $_ENV['DB_PASS'] ?? '';

        try {
            $this->connection = new PDO(
                "mysql:host=$host;dbname=$dbname;port=$port;charset=utf8mb4",
                $user,
                $pass
            );
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Connection error: " . $e->getMessage());
        }
    }

    public function getConnection(): PDO {
        return $this->connection;
    }
}
