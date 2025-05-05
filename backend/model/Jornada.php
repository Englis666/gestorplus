<?php
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

    public function finalizarJornada(string $num_doc): bool {
        date_default_timezone_set('America/Bogota');
        $fecha = date('Y-m-d');
        $horaSalida = date('H:i:s');

        $sql = "UPDATE jornada 
                SET horaSalida = :horaSalida, estadoJornada = 'Finalizada' 
                WHERE usuario_num_doc = :num_doc AND fecha = :fecha AND horaSalida IS NULL";

        return $this->dbService->ejecutarUpdate($sql, [
            ':horaSalida' => $horaSalida,
            ':num_doc'    => $num_doc,
            ':fecha'      => $fecha,
        ]);
    }
}
