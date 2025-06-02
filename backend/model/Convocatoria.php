<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types = 1);
namespace Model;

use Service\DatabaseService;
use PDOException;

class Convocatoria {
    private DatabaseService $dbService;
    
    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerConvocatorias() {
        $sql = "SELECT * FROM convocatoria as c 
                INNER JOIN cargo as ca ON c.cargo_idCargo = ca.idCargo";
        
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function agregarConvocatoria($data) {
        try {
            $sql = "INSERT INTO convocatoria (nombreConvocatoria, descripcion, requisitos, salario,
                        cantidadConvocatoria, cargo_idcargo)
                    VALUES (:nombreConvocatoria, :descripcion, :requisitos, :salario, :cantidadConvocatoria, :cargo_idcargo)";
            
            $params = [
                ':nombreConvocatoria' => $data['nombreConvocatoria'],
                ':descripcion' => $data['descripcion'],
                ':requisitos' => $data['requisitos'],
                ':salario' => $data['salario'],
                ':cantidadConvocatoria' => $data['cantidadConvocatoria'],
                ':cargo_idcargo' => $data['idcargo']
            ];
            
            $this->dbService->ejecutarConsulta($sql, $params);

            return true;
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return false;
        }
    }

    public function obtenerDetalleConvocatoria($idconvocatoria) {
        try {
            $sql = "SELECT * FROM convocatoria WHERE idconvocatoria = :idconvocatoria LIMIT 1";
            
            $params = [':idconvocatoria' => $idconvocatoria];
            $resultado = $this->dbService->ejecutarConsulta($sql, $params);

            if ($resultado) {
                return $resultado[0];
            }
            return null;
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return null;
        }
    }
    public function activarConvocatoria($idconvocatoria){
        try{
            $sql = "UPDATE convocatoria SET estado = 'activo' WHERE idconvocatoria = :idconvocatoria";
            $params = [':idconvocatoria' => $idconvocatoria];
            $this->dbService->ejecutarConsulta($sql, $params);
            return true;
        } catch (PDOException $e){
            echo json_encode(['error' => 'Error al activar la convocatoria: ' . $e->getMessage()]);
            http_response_code(500);
            return false;
        }
    }

    public function desactivarConvocatoria($idconvocatoria){
        try{
            $sql = "UPDATE convocatoria SET estado = 'inactivo' WHERE idconvocatoria = :idconvocatoria";
            $params = [':idconvocatoria' => $idconvocatoria];
            $this->dbService->ejecutarConsulta($sql, $params);
            return true;
        } catch (PDOException $e){
            echo json_encode(['error' => 'Error al desactivar la convocatoria:' . $e->getMessage()]);
            http_response_code(500);
            return false;
        }
    }


}
?>
