<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Vacaciones{

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    private function ejecutarConsulta($sql, $params = []){
        try{
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e){
            echo json_encode(['error' => 'Ocurrio un error en la base de datos']);
            http_response_code(500);
            return [];
        }

    }

    public function obtenerTodasLasVacaciones() {
        $sql = "SELECT * FROM vacacion as v 
                INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc";
        return $this->ejecutarConsulta($sql);
    }


    public function obtenerMisVacaciones($num_doc){
        try{
            $sql = "SELECT * FROM vacacion WHERE usuario_num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":num_doc" , $num_doc, PDO::PARAM_INT);
            $stmt->execute();
            
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if($resultado){
                return $resultado;
            }
            return[];
        }catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function solicitarVacaciones($num_doc, $data){
        try{
            $estado = 'Pendiente';
            $sql = "INSERT INTO vacacion (fechaInicio, fechaFin,estadoVacacion, usuario_num_doc) VALUES (? , ? , ? , ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['fechaInicio'],
                $data['fechaFin'],
                $estado,
                $num_doc
            ]);
        
            if($stmt->rowCount() > 0 ){
                $descripcionNotificacion = "El empleado identificado con la cedula $num_doc ha solicitado una vacacion";
                $sql = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) VALUES ( ? , ? , ? , ? )";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([
                    $descripcionNotificacion,
                    'Pendiente',
                    'General ',
                    $num_doc
                ]);
                
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            error_log($e->getMessage());
            return false;
        }
    }
   





}