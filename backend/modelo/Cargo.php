<?php

declare(strict_types=1);

namespace Modelo;

use PDO;
use PDOException;
use Exception;

class Cargo
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
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
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$idCargo]);
        } catch (PDOException $e) {
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
    public function desactivarCargo(int $idCargo): bool
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
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$idCargo]);
        } catch (PDOException $e) {
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
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$idCargo]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return isset($row['total']) ? (int) $row['total'] : 0;
        } catch (PDOException $e) {
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
            $stmt = $this->db->query($sql);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
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
            $stmt = $this->db->prepare($sql);
            if ($stmt->execute([$nombreCargo])) {
                return (int)$this->db->lastInsertId();
            }
            return null;
        } catch (PDOException $e) {
            throw new Exception('Error al agregar el cargo: ' . $e->getMessage(), 500);
        }
    }
}
