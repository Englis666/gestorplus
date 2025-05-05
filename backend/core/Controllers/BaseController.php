<?php
namespace Core\Controllers;

use Service\JsonResponseService;
use Service\ValidationService;
use Service\DatabaseService;
use PDO;

abstract class BaseController {
    protected JsonResponseService $jsonResponseService;
    protected ValidationService $validator;
    protected DatabaseService $dbService;
    protected PDO $db;

    public function __construct() {
        $this->jsonResponseService = new JsonResponseService();
        $this->validator = new ValidationService();
        $this->db = (new \Config\Database())->getConnection();
        $this->dbService = new DatabaseService($this->db);
    }

    /**
     * Valida que $data contenga todas las claves requeridas en $camposRequeridos.
     * Si falta alguna, responde con error y retorna false.
     */
    protected function parametrosRequeridos(array $data, array $camposRequeridos): bool {
        if (!$this->validator->verificarDatosRequeridos($data, $camposRequeridos)) {
            $this->jsonResponseService->responderError("Faltan datos requeridos", 422);
            return false;
        }
        return true;
    }

    /**
     * Extrae y convierte un parámetro a entero. Retorna 0 si no existe.
     */
    protected function getIntParam(array $data, string $key): int {
        return isset($data[$key]) ? (int) $data[$key] : 0;
    }
}
