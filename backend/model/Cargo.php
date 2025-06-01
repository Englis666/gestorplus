<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */


declare(strict_types=1);

namespace Model;

use Service\DatabaseService;
use Exception;

class Cargo
{
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService)
    {
        $this->dbService = $dbService;
    }

    /**
     * Activa un cargo estableciendo su estado a 'Activa'.
     *
     * @param int $idCargo
     * @return bool
     * @throws Exception
     */
    public function activarCargo(int $idCargo): bool
    {
        try {
            $sql = "UPDATE cargo SET estadoCargo = 'Activo' WHERE idCargo = ?";
            $params = [$idCargo];
            return $this->dbService->ejecutarUpdate($sql, $params);
        } catch (Exception $e) {
            throw new Exception('Error al activar el cargo: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Desactiva un cargo si no tiene convocatorias relacionadas.
     *
     * @param int $idCargo
     * @return bool
     * @throws Exception
     */
    public function desactivarCargo(int $idCargo): bool|array
    {
        $relCount = $this->verificarCargosRelacionadosEnConvocatorias($idCargo);
        if ($relCount > 0) {
            throw new Exception(
                'No se puede desactivar el cargo: existen ' . $relCount . ' convocatoria(s) relacionada(s).',
                400
            );
        }

        try {
            $sql = "UPDATE cargo SET estadoCargo = 'Inactiva' WHERE idCargo = ?";
            $params = [$idCargo];
            return $this->dbService->ejecutarUpdate($sql, $params);
        } catch (Exception $e) {
            throw new Exception('Error al desactivar el cargo: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Cuenta cuántas convocatorias están relacionadas con un cargo.
     *
     * @param int $idCargo
     * @return int
     * @throws Exception
     */
    public function verificarCargosRelacionadosEnConvocatorias(int $idCargo): int
    {
        try {
            $sql = "SELECT COUNT(*) AS total FROM convocatoria WHERE cargo_idCargo = ?";
            $params = [$idCargo];
            $result = $this->dbService->ejecutarConsulta($sql, $params);
            return isset($result[0]['total']) ? (int)$result[0]['total'] : 0;
        } catch (Exception $e) {
            throw new Exception('Error al verificar relaciones de convocatorias: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Retorna todos los cargos en el sistema.
     *
     * @return array
     */
    public function obtenerCargos(): array
    {
        try {
            $sql = "SELECT * FROM cargo";
            $result = $this->dbService->ejecutarConsulta($sql);
            return $result ?: [];
        } catch (Exception $e) {
            throw new Exception('Error al obtener cargos: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Agrega un nuevo cargo.
     *
     * @param string $nombreCargo
     * @return int|null
     * @throws Exception
     */
    public function agregarCargo(string $nombreCargo): ?int
    {
        try {
            $sql = "INSERT INTO cargo (nombreCargo, estadoCargo) VALUES (?, 'Activo')";
            $params = [$nombreCargo];
            return $this->dbService->ejecutarInsert($sql, $params);
        } catch (Exception $e) {
            throw new Exception('Error al agregar el cargo: ' . $e->getMessage(), 500);
        }
    }
}
