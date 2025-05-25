<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Infrastructure\Persistence;

use PDO;

class DatabaseConnection{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO{
        if (self::$connection === null){
            self::$connection = new PDO('mysql:host=', [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
        }
        return self::$connection;
    }
}
