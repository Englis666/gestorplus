<?php

namespace Model;
use Config\Database;
use PDO;
use PDOException;

class Evaluacion{
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

    public function obtenerSistemaDeGestion() {
        $sql = "SELECT * FROM evaluacionessg as e 
                INNER JOIN postulacion as p ON e.entrevista_postulacion_idpostulaciones = p.idpostulacion
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc";
        return $this->ejecutarConsulta($sql);
    }

    public function guardarResultadosSistemaDeGestion($data){
        $sql = "INSERT INTO evaluacionessg 
                (estado_salud, evaluacionRiesgos, recomendaciones, aptitudLaboral, comentarios, 
                 entrevista_identrevista, entrevista_postulacion_idpostulaciones, estadoEvaluacion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['estado_salud'],
                $data['evaluacionRiesgos'],
                $data['recomendaciones'],
                $data['aptitudLaboral'],
                $data['comentarios'], 
                $data['identrevista'],
                $data['idpostulacion'],
                $data['estadoEvaluacion'],
            ]);
            return true;
        } catch (PDOException $e) {
            error_log('Error en guardarResultadosSistemaDeGestion: ' . $e->getMessage());
            return false;
        }
    }

    public function buscarIdEvaluacion($identrevista) {
        $stmt = $this->db->prepare("SELECT idevaluacion FROM evaluacionessg WHERE entrevista_identrevista = ?");
        $stmt->execute([$identrevista]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


}