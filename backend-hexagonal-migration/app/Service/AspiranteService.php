<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace App\Service;

use Domian\Repository\AspiranteREpositoryInterface;
use Infrastructure\Repository\AspiranteRepository;


class AspiranteService{
    private AspiranteRepositoryInterface $repository;

    public function __construct(){
        $this->repository = new AspiranteRepository();
    }

    public function aplicarAspirante(string $num_doc, int $idconvocatoria){
        $this->repository->aplicar($num_doc,$idconvocatoria);
    }

}
