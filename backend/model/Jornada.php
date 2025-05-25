<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);
namespace Model;

use Service\DatabaseService;

class Jornada {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    public function corroborarJornada(int $idJornada): bool {
        $sql = "UPDATE jornada SET estadoJornada = 'Jornada Corroborada' WHERE idjornada = :idjornada";
        return $this->dbService->ejecutarUpdate($sql, [':idjornada' => $idJornada]);
    }

    public function noCorroborarJornada(int $idJornada): bool {
        $sql = "UPDATE jornada SET estadoJornada = 'Jornada rechazada' WHERE idjornada = :idjornada";
        return $this->dbService->ejecutarUpdate($sql, [':idjornada' => $idJornada]);
    }

    public function obtenerTodasLasJornadas(): array {
        $sql = "SELECT * FROM jornada AS j
                INNER JOIN usuario AS u ON j.usuario_num_doc = u.num_doc
                WHERE estadoJornada != 'Jornada Corroborada'";
        return $this->dbService->ejecutarConsulta($sql);
    }

    public function obtenerJornadas(string $num_doc): array {
        $sql = "SELECT * FROM jornada AS j
                INNER JOIN usuario AS u ON j.usuario_num_doc = u.num_doc
                WHERE u.num_doc = :num_doc";
        return $this->dbService->ejecutarConsulta($sql, [':num_doc' => $num_doc]);
    }

    public function finalizarJornada(string $fecha, int $num_doc): bool {
        $validarJornada = $this->validarFinalizacionJornadaExacta($fecha, $num_doc);
        
        if ($validarJornada) {
            $horaSalida = date('H:i:s'); 
            
            $sqlFinalizarJornada = "UPDATE jornada SET horaSalida = :horaSalida WHERE fecha = :fecha AND usuario_num_doc = :num_doc";
            
            $params = [
                ':horaSalida' => $horaSalida,
                ':fecha' => $fecha,
                ':num_doc' => $num_doc,
            ];
            
            $resultado = $this->dbService->ejecutarUpdate($sqlFinalizarJornada, $params, false);
        }
        return false;
    }
    
    public function validarFinalizacionJornadaExacta(string $fecha, int $num_doc): bool {
        $sql = "SELECT idJornada FROM jornada WHERE fecha = :fecha AND usuario_num_doc = :num_doc";
        $resultado = $this->dbService->ejecutarConsulta($sql, [':fecha' => $fecha, ':num_doc' => $num_doc], true);
        return !empty($resultado);
    }
    

}
