<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types = 1);
namespace Model;
use Service\DatabaseService; 
use PDO;
use PDOException;


class Perfil{
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    public function datosPerfil($num_doc): array {
        $sql = "SELECT * FROM usuario as u
                INNER JOIN hojadevida as h ON u.hojadevida_idHojadevida = h.idHojadevida 
                WHERE num_doc = :num_doc";
        return $this->dbService->ejecutarConsulta($sql, [':num_doc' => $num_doc], true);
    }
    
    public function actualizarPerfil($num_doc, array $data): bool {
        $sql = "UPDATE usuario SET nombres = ?, apellidos = ?, email = ?, tipodDoc = ? WHERE num_doc = ?";
        return $this->dbService->ejecutarAccion($sql, [
            $data['nombres'],
            $data['apellidos'],
            $data['email'],
            $data['tipodDoc'],
            $num_doc
        ]);
    }
    
}
