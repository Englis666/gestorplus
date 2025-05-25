<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Service;

class jsonResponseService {
    public function responder(array $data, int $statusCode = 200): void {
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }

    public function responderError($mensaje, int $statusCode = 400): void {
        if (is_array($mensaje)) {
            $this->responder($mensaje, $statusCode);
        } else {
            $this->responder(['error' => $mensaje], $statusCode);
        }
    }
}
