<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Service;

use PDO;
use PDOException;
use Service\JsonResponseService;

class DatabaseService {
    private PDO $db;
    private JsonResponseService $jsonResponseService;

    public function __construct(PDO $db) {
        $this->db = $db;
        $this->jsonResponseService = new JsonResponseService();
    }

    public function ejecutarConsulta(string $sql, array $params = [], bool $single = false) {
        try {
            $stmt = $this->db->prepare($sql);
            if ($stmt === false) {
                throw new PDOException('Error al preparar la consulta SQL');
            }
            $stmt->execute($params);
            return $single ? $stmt->fetch(PDO::FETCH_ASSOC) : $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->jsonResponseService->responderError(['error' => 'Ocurrio un error en la base de datos', 'detalle' => $e->getMessage()]);
            return []; 
        }
    }

    public function ejecutarAccion(string $sql, array $params = []): bool {
        try {
            $stmt = $this->db->prepare($sql);
            if ($stmt === false) {
                throw new PDOException('Error al preparar la consulta SQL');
            }
            $stmt->execute($params);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            $this->jsonResponseService->responderError(['error' => 'Ocurrio un error al ejecutar la consulta', 'detalle' => $e->getMessage()]);
            return false;
        }
    }

    public function ejecutarInsert(string $sql, array $params = []): ?int {
        try {
            $stmt = $this->db->prepare($sql);
            if ($stmt === false) {
                throw new PDOException('Error al preparar la consulta SQL');
            }
            $stmt->execute($params);
            return (int) $this->db->lastInsertId();
        } catch (PDOException $e) {
            $this->jsonResponseService->responderError(['error' => 'Ocurrio un error al insertar en la base de datos', 'detalle' => $e->getMessage()]);
            return null;
        }
    }

    public function ejecutarUpdate(string $sql, array $params = []): array {
        try {
            $stmt = $this->db->prepare($sql);
            if ($stmt === false) {
                throw new PDOException('Error al preparar la consulta SQL');
            }
            $stmt->execute($params);
            return [
                'exito' => true,
                'filas_afectadas' => $stmt->rowCount()
            ];
        } catch (PDOException $e) {
            return [
                'exito' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    
    // Iniciar transacción
    public function iniciarTransaccion(): void {
        $this->db->beginTransaction();
    }

    // Confirmar transacción
    public function confirmarTransaccion(): void {
        $this->db->commit();
    }

    // Revertir transacción
    public function revertirTransaccion(): void {
        $this->db->rollBack();
    }
    
    public function getConnection(): PDO{
        return $this->db;
    }

}
