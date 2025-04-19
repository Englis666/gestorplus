<?php
namespace Servicio;

class jsonResponseService{
    public function responder(array $data, int $statusCode = 200):void{
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }
}