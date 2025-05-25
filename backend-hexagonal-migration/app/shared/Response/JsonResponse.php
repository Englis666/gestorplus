<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */


namespace Shared\Response;

class JsonResponse{
    public static function success(array $data, int $status = 200): void{
        http_response_code($status);
        echo json_encode(['status' => 'success'] + $data);
    }
    public static function error(string $message, int $status = 500): void{
        http_response_code($status);
        echo json_encode(['status' => 'error' , 'message' => $message]);
    }

}

