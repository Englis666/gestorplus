<?php
declare(strict_types = 1);
namespace Model;

use Service\DatabaseService;
use PDO;
use PDOException;
use Exception;

class PazySalvo{
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }    

    public function obtenerPazYSalvos(){
        $sql = "SELECT * FROM pazysalvo";
        $stmt = $this->dbService->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

    public function obtenerMiPazYSalvo($num_doc) {
        try {
            $sql = "SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc";
            $stmtVinculacion = $this->dbService->prepare($sql);
            $stmtVinculacion->bindParam(':num_doc', $num_doc, PDO::PARAM_STR); 
            $stmtVinculacion->execute();
    
            $vinculacion = $stmtVinculacion->fetch(PDO::FETCH_ASSOC);
    
            if ($vinculacion) {
                $sql = "SELECT * FROM pazysalvo WHERE vinculacion_idvinculacion = :vinculacion_idvinculacion";
                $stmt = $this->dbService->prepare($sql);
                $stmt->bindParam(':vinculacion_idvinculacion', $vinculacion['idvinculacion'], PDO::PARAM_INT);
                $stmt->execute();
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                return $resultado ? $resultado : [];
            }
    
            return []; 
    
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }
    
    public function crearPazYSalvo(array $data): bool
    {
        try {
            if (isset($data['empleado']) && is_array($data['empleado']) && isset($data['empleado']['num_doc'])) {
                $stmt = $this->dbService->prepare("SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc");
                $stmt->execute([':num_doc' => $data['empleado']['num_doc']]);
                $idVinculacion = $stmt->fetchColumn();
        
                if (!$idVinculacion) {
                    throw new Exception('No se encontró la vinculación del empleado');
                }
        
                $sql = "INSERT INTO pazysalvo (motivo, fechaEmision, estado, documentoPazysalvo, vinculacion_idvinculacion)
                        VALUES (:motivo, :fechaEmision, :estado, :documentoPazysalvo, :vinculacion_idvinculacion)";
                $stmt = $this->dbService->prepare($sql);
                $stmt->execute([
                    ':motivo' => $data['motivo'],
                    ':fechaEmision' => $data['fechaEmision'],
                    ':estado' => $data['estado'],
                    ':documentoPazysalvo' => $data['documentoPazysalvo'] ?? null,
                    ':vinculacion_idvinculacion' => $idVinculacion
                ]);
        
                if ($stmt->rowCount() > 0) {
                    return true;
                } else {
                    throw new Exception('No se pudo insertar el Paz y Salvo');
                }
            } else {
                throw new Exception('El empleado no está especificado correctamente');
            }
        } catch (Exception $e) {
            error_log('Error al insertar Paz y Salvo: ' . $e->getMessage());
            return false;
        }
    }
}
