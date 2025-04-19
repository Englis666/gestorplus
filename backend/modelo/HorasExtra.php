<?php
namespace Modelo;
use Config\Database;
use PDO;
use PDOException;

class HorasExtra{
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    private function ejectutarConsulta($sql, $params = []){
        try{
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO:FETCH_ASSOC);
        } catch (PDOException $e){
            echo json_encode(['error' => 'Ocurrio un error en la base de datos']);
            http_response_code(500);
            return [];
        }
    }

    public function obtenerTodasLasHorasExtra(){
        $sql = "SELECT * FROM horaextra";
        return $this->ejecutarConsulta($sql);
    }



}