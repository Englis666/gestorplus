<?php
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