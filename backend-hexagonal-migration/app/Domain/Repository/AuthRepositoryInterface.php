<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Domain\Repository;

interface AuthRepositoryInterface{
    public function registrar(array $data): string;
    public  function buscarUsuarioPorNumDoc(string $num_doc): ?array;
}
