<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
namespace Config;

use PDO;
use PDOException;

class DataBase {
    private $host = "gestorplus-db"; //Usando Docker
    private $db_name = "gestorplus"; 
    private $username = "root"; 
    private $password = "gestorplustfu";  // Contraseña definida en docker-compose.yml  
    private $conn;

    public function getConnection(): ?PDO {
        $this->conn = null;

        try {
            $dsn = "mysql:host=$this->host;dbname=$this->db_name;charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ]);
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
