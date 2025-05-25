<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);
namespace Model;

use Service\DatabaseService;

class Estudio {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    /**
     * Obtiene los estudios asociados a un hoja de vida.
     *
     * @param int $idhojadevida
     * @return array
     */
    public function obtenerEstudio(int $idhojadevida): array {
        $sql = "SELECT * FROM estudio WHERE hojadevida_idhojadevida = :idhojadevida";
        $params = [':idhojadevida' => $idhojadevida];
        return $this->dbService->ejecutarConsulta($sql, $params);
    }

    /**
     * Agrega un nuevo estudio a la base de datos.
     *
     * @param array $data
     * @param int $hojadevida_idHojadevida
     * @return bool
     */
    public function agregarEstudio(array $data, int $hojadevida_idHojadevida): bool {
        $sql = "INSERT INTO estudio 
                (nivelEstudio, areaEstudio, estadoEstudio, fechaInicioEstudio, 
                 fechaFinEstudio, tituloEstudio, institucionEstudio, ubicacionEstudio, modalidad, 
                 paisInstitucion, duracionEstudio, materiasDestacadas, hojadevida_idHojadevida) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            $data['nivelEstudio'],
            $data['areaEstudio'],
            $data['estadoEstudio'],
            $data['fechaInicioEstudio'],
            $data['fechaFinEstudio'],
            $data['tituloEstudio'],
            $data['institucionEstudio'],
            $data['ubicacionEstudio'],
            $data['modalidad'],
            $data['paisInstitucion'],
            $data['duracionEstudio'],
            $data['materiasDestacadas'],
            $hojadevida_idHojadevida
        ];

        return $this->dbService->ejecutarAccion($sql, $params);
    }

    /**
     * Actualiza los datos de un estudio existente.
     *
     * @param array $data
     * @return bool
     */
    public function actualizarEstudio(array $data): bool {
        $sql = "
            UPDATE estudio
            SET nivelEstudio = ?, areaEstudio = ?, estadoEstudio = ?, fechaInicioEstudio = ?, 
                fechaFinEstudio = ?, tituloEstudio = ?, institucionEstudio = ?, ubicacionEstudio = ?
            WHERE idestudio = ?
        ";

        $params = [
            $data['nivelEstudio'],
            $data['areaEstudio'],
            $data['estadoEstudio'],
            $data['fechaInicioEstudio'],
            $data['fechaFinEstudio'],
            $data['tituloEstudio'],
            $data['institucionEstudio'],
            $data['ubicacionEstudio'],
            $data['idestudio']
        ];

        return $this->dbService->ejecutarAccion($sql, $params);
    }

    /**
     * Elimina un estudio de la base de datos.
     *
     * @param int $idestudio
     * @return bool
     */
    public function eliminarEstudio(int $idestudio): bool {
        $sql = "DELETE FROM estudio WHERE idestudio = :idestudio";
        $params = [':idestudio' => $idestudio];
        return $this->dbService->ejecutarAccion($sql, $params);
    }
}
