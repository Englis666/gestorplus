<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Infrastructure\Repository;

use Domain\Repository\AspiranteRepositoryInterface;
use PDO;

class AspiranteRepository implements AspiranteRepositoryInterface{
    private PDO $db;

    public function __construct(){
        $this->db = new PDO("mysql:host=lo");
    }

    public function aplicar(string $num_doc, int $idconvocatoria): void{
        $stmt = $this->db->prepare("INSERT INTO postulacion");
        $stmt->execute([$num_doc, $idconvocatoria]);
    }

}
