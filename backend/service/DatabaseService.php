<?php
namespace Service;

use PDO;
use PDOException;
use Service\JsonResponseService;

class DatabaseService{
    private PDO $db;
    private JsonResponseService $jsonResponseService;

    public function __construct(PDO $db){
        $this->db = $db;
        $this->jsonResponseService = new JsonResponseService();
    }

    public function ejecutarConsulta($sql, $params = []){
        try{
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e){
            $this->jsonResponseService->responderError(['error' => 'Ocurrio un error en la base de datos']);
            return [];
        }
    }

    public function ejecutarInsert($sql, $params = []){
        try{
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e){
            $this->jsonResponseService->responderError(['error' => 'Ocurrio un error al insertar en la base de datos']);
            return false;
        }
    }

    public function ejecutarUpdate($sql, $params = []){
        try{
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->rowCount() > 0;
        } catch  (PDOException $e){
            $this->jsonResponseService->responderError(['error' => 'Ocurrio un error al actualizar']);
            return false;
        }
    }
}
