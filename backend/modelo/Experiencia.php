<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

class Experiencia{
    private $db;

    public function  __construct($db){
        $this->db = $db;
    }
    private function ejectuarConsulta($sql, $params = []){
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

    public function obtenerExperiencia($idhojadevida){
        $sql = "SELECT * FROM experiencialaboral WHERE hojadevida_idhojadevida = :idhojadevida";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idhojadevida', $idhojadevida, PDO::PARAM_INT);
        $stmt->execute();
    
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if ($resultado) {
            return $resultado;
        } else {
            return false;
        }
    }

    public function eliminarExperiencia($idexperiencialaboral) {
        $sql = "DELETE FROM experiencialaboral WHERE idexperienciaLaboral = :idexperienciaLaboral";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idexperienciaLaboral', $idexperiencia, PDO::PARAM_INT);

        return $stmt->execute();
    }
    
    public function agregarExp($data, $hojadevida_idHojadevida) {
        $sql = "INSERT INTO experiencialaboral 
                (profesion, descripcionPerfil, fechaInicioExp, fechaFinExp, hojadevida_idHojadevida) 
                VALUES (?, ?, ?, ?, ?)";
        
        $stmtUsuario = $this->db->prepare($sql);    
        
        $stmtUsuario->execute([
            $data['profesion'],
            $data['descripcionPerfil'],
            $data['fechaInicioExp'],
            $data['fechaFinExp'],
            $hojadevida_idHojadevida
        ]);    
    
        return json_encode(['message' => 'Experiencia agregada']);
    }




}