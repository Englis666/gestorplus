<?php
declare(strict_types = 1);
namespace Model;

use Service\DatabaseService;
use Exception;

class PazySalvo {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    public function obtenerPazYSalvos() {
        $sql = "SELECT * FROM pazysalvo
                INNER JOIN vinculacion ON pazysalvo.vinculacion_idvinculacion = vinculacion.idvinculacion
                INNER JOIN usuario ON vinculacion.usuario_num_doc = usuario.num_doc";
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function obtenerMiPazYSalvo($num_doc) {
        try {
            $sql = "SELECT idvinculacion FROM vinculacion 
                    INNER JOIN usuario ON vinculacion.usuario_num_doc = usuario.num_doc
                    INNER JOIN pazysalvo ON vinculacion.idvinculacion = pazysalvo.vinculacion_idvinculacion
                    WHERE usuario_num_doc = :num_doc";
            $vinculacion = $this->dbService->ejecutarConsulta($sql, [':num_doc' => $num_doc], true);

            if ($vinculacion) {
                $sql = "SELECT * FROM pazysalvo WHERE vinculacion_idvinculacion = :vinculacion_idvinculacion";
                return $this->dbService->ejecutarConsulta($sql, [':vinculacion_idvinculacion' => $vinculacion['idvinculacion']]);
            }

            return []; 

        } catch (\PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function crearPazYSalvo(array $data): bool {
        try {
            if (isset($data['empleado']) && is_array($data['empleado']) && isset($data['empleado']['num_doc'])) {
                $sql = "SELECT idvinculacion FROM vinculacion WHERE usuario_num_doc = :num_doc";
                $vinculacion = $this->dbService->ejecutarConsulta($sql, [':num_doc' => $data['empleado']['num_doc']], true);

                if (!$vinculacion) {
                    throw new Exception('No se encontró la vinculación del empleado');
                }

                $sql = "INSERT INTO pazysalvo (motivo, fechaEmision, estado, documentoPazysalvo, vinculacion_idvinculacion)
                        VALUES (:motivo, :fechaEmision, :estado, :documentoPazysalvo, :vinculacion_idvinculacion)";
                $params = [
                    ':motivo' => $data['motivo'],
                    ':fechaEmision' => $data['fechaEmision'],
                    ':estado' => $data['estado'],
                    ':documentoPazysalvo' => $data['documentoPazysalvo'] ?? null,
                    ':vinculacion_idvinculacion' => $vinculacion['idvinculacion']
                ];

                $insertResult = $this->dbService->ejecutarInsert($sql, $params);
                
                return $insertResult !== null;

            } else {
                throw new Exception('El empleado no está especificado correctamente');
            }
        } catch (Exception $e) {
            error_log('Error al insertar Paz y Salvo: ' . $e->getMessage());
            return false;
        }
    }
}
