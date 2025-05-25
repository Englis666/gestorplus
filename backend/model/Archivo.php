<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Model;

use Service\DatabaseService;

class Archivo {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function subirContrato($idVinculacion, $rutaArchivo, $num_doc) {
        $this->dbService->iniciarTransaccion();
        try {
            $query = "UPDATE vinculacion SET documentoContrato = :ruta WHERE idvinculacion = :idVinculacion";
            $params = [':ruta' => $rutaArchivo, ':idVinculacion' => $idVinculacion];
            if (!$this->dbService->ejecutarUpdate($query, $params)) {
                throw new \Exception("No se pudo actualizar el contrato");
            }
            $updateRolQuery = "UPDATE usuario SET rol_idrol = :nuevoRol WHERE num_doc = :num_doc";
            $params = [':nuevoRol' => 3, ':num_doc' => $num_doc];
            if (!$this->dbService->ejecutarUpdate($updateRolQuery, $params)) {
                throw new \Exception("No se pudo actualizar el rol del usuario");
            }
            $this->dbService->confirmarTransaccion();
            return true;
        } catch (\Exception $e) {
            $this->dbService->revertirTransaccion();
            return false;
        }
    }

    public function obtenerContrato($num_doc) {
        $query = "SELECT documentoContrato FROM vinculacion WHERE usuario_num_doc = :num_doc";
        $params = [':num_doc' => $num_doc];
        $result = $this->dbService->ejecutarConsulta($query, $params);
        
        return $result ? $result[0] : null;
    }
}
