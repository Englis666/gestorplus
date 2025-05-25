<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Service;

use Service\JsonResponseService;

class ValidationService
{
    private JsonResponseService $jsonResponseService;

    public function __construct()
    {
        $this->jsonResponseService = new JsonResponseService();
    }

    public function verificarDatosRequeridos(array $data, array $camposRequeridos): bool
    {
        foreach ($camposRequeridos as $campo) {
            if (!isset($data[$campo])) {
                $this->jsonResponseService->responder([
                    'error' => "Falta el campo requerido: $campo"
                ], 400);
                return false;
            }
        }
        return true;
    }
}
