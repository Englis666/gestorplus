<?php
namespace Model;

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
        $stmt->bindParam(':idexperienciaLaboral', $idexperiencialaboral, PDO::PARAM_INT);

        return $stmt->execute();
    }
    
    public function agregarExp($data, $hojadevida_idHojadevida) {
        $sql = "INSERT INTO experiencialaboral 
                (profesion, descripcionPerfil, fechaInicioExp, fechaFinExp, cargo,empresa, ubicacionEmpresa, tipoContrato, salario,logros,referenciasLaborales, fechaIngreso,fechaSalida,hojadevida_idHojadevida) 
                VALUES (?, ?, ?, ?, ?)";
        
        $stmtUsuario = $this->db->prepare($sql);    
        
        $stmtUsuario->execute([
            $data['profesion'],
            $data['descripcionPerfil'],
            $data['fechaInicioExp'],
            $data['fechaFinExp'],
            $data['cargo'],
            $data['empresa'],
            $data['ubicacionEmpresa'],
            $data['tipoContrato'],
            $data['salario'],
            $data['logros'],
            $data['referenciasLaborales'],
            $data['fechaIngreso'],
            $data['fechaSalida'],
            $hojadevida_idHojadevida
        ]);    
    
        return json_encode(['message' => 'Experiencia agregada']);
    }

    public function actualizarExperiencia($data) {
        $sql = 'UPDATE experiencialaboral SET profesion = ?, descripcionPerfil = ?, fechaInicioExp = ?, fechaFinExp = ? WHERE idexperienciaLaboral = ?';

        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(1, $data['profesion'], PDO::PARAM_STR);
        $stmt->bindParam(2, $data['descripcionPerfil'], PDO::PARAM_STR);
        $stmt->bindParam(3, $data['fechaInicioExp'], PDO::PARAM_STR);
        $stmt->bindParam(4, $data['fechaFinExp'], PDO::PARAM_STR);
        $stmt->bindParam(5, $data['idexperienciaLaboral'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }


}