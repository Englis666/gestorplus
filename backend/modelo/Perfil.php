<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;


class Perfil{

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    private function ejectuarConsulta($sql, $params = []){
        try{
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e){
            echo json_encode(['error' => 'Hubo un error en la base de datos']);
            http_response_code(500);
            return [];
        }
    }


    public function datosPerfil($num_doc){
        $sql = "SELECT * FROM usuario as u
                 INNER JOIN hojadevida as h ON u.hojadevida_idHojadevida = h.idHojadevida 
        WHERE num_doc = :num_doc";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
        $stmt->execute();
        
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }

    return [];
    }


    //Realizar
    //public function actualizarPerfil(){


    //}

    



}
