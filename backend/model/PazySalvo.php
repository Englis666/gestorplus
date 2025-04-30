<?php
namespace Model;

use Config\Database;
use PDO;
use PDOException;

class PazySalvo{

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
            echo json_encode(['error' => 'Ocurrio un error en la base de datos']);
            http_response_code(500);
            return [];
        }
    }  

    public function obtenerPazYSalvos(){
        $sql = "SELECT * FROM pazysalvo";
        $stmt = $this->db->prepare($sql);
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
            $stmtVinculacion = $this->db->prepare($sql);
            $stmtVinculacion->bindParam(':num_doc', $num_doc, PDO::PARAM_STR); 
            $stmtVinculacion->execute();
    
            $vinculacion = $stmtVinculacion->fetch(PDO::FETCH_ASSOC);
    
            if ($vinculacion) {
                $sql = "SELECT * FROM pazysalvo WHERE vinculacion_idvinculacion = :vinculacion_idvinculacion";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':vinculacion_idvinculacion', $vinculacion_idvinculacion, PDO::PARAM_INT);
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
            // Verificar si 'empleado' es un array y tiene 'num_doc'
            if (isset($data['empleado']) && is_array($data['empleado']) && isset($data['empleado']['num_doc'])) {
                // Buscar idvinculacion del empleado
                $stmt = $this->db->prepare("SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc");
                $stmt->execute([':num_doc' => $data['empleado']['num_doc']]);
                $idVinculacion = $stmt->fetchColumn();
        
                if (!$idVinculacion) {
                    throw new Exception('No se encontró la vinculación del empleado');
                }
        
                // Insertar el Paz y Salvo
                $sql = "INSERT INTO pazysalvo (motivo, fechaEmision, estado, documentoPazysalvo, vinculacion_idvinculacion)
                        VALUES (:motivo, :fechaEmision, :estado, :documentoPazysalvo, :vinculacion_idvinculacion)";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([
                    ':motivo' => $data['motivo'],
                    ':fechaEmision' => $data['fechaEmision'],
                    ':estado' => $data['estado'],
                    ':documentoPazysalvo' => $data['documentoPazysalvo'] ?? null,
                    ':vinculacion_idvinculacion' => $idVinculacion
                ]);
        
                // Verificar si se insertó correctamente
                if ($stmt->rowCount() > 0) {
                    return true; // Inserción exitosa
                } else {
                    // Si no se insertó nada, lanzar una excepción
                    throw new Exception('No se pudo insertar el Paz y Salvo');
                }
            } else {
                throw new Exception('El empleado no está especificado correctamente');
            }
        } catch (Exception $e) {
            // En caso de error, capturar la excepción y registrar el error
            error_log('Error al insertar Paz y Salvo: ' . $e->getMessage());
            return false; // No se pudo insertar el Paz y Salvo
        }
    }
    






}
