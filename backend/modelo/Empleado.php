<?php
namespace Modelo;

use Config\Database;

use PDO;
use PDOException;

class Empleado {

    private $db;
    public function __construct($db){
        $this->db = $db;
    }
    
    private function ejecutarConsulta($sql, $params = []) {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Ocurrió un error en la base de datos']);
            http_response_code(500);
            return [];
        }
    }

    
  

    
   



    public function solicitarQueja($num_doc,$data){
        try{
            $descripcionNotificacion = 'El usuario identificado con el número de documento '.$num_doc.' ha realizado una queja relacionada con la jornada ' . $data['fecha'];

            $sql = "INSERT INTO notificacion (descripcionNotificacion,estadoNotificacion,tipo,num_doc) VALUES (:descripcionNotificacion,:estadoNotificacion,:tipo,:num_doc)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':descripcionNotificacion', $descripcionNotificacion, PDO::PARAM_STR);
            $stmt->bindParam(':estadoNotificacion', 'Pendiente', PDO::PARAM_STR);
            $stmt->bindParam(':tipo', 'General', PDO::PARAM_STR);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_STR);
            $stmt->execute();
            $id = $this->db->lastInsertId();
            if($id){
                return $id;
            }
            return 0;
        }catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return 0;
        }

    }

    

   

    
    

}
?>