<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Domain\Repository;

interface AspiranteRepositoryInterface{
    public function aplicar(string $num_doc, int $idConvocatoria): void;
}
