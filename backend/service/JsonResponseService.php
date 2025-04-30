<?php
namespace Service;

class jsonResponseService{
    public function responder(array $data, int $statusCode = 200):void{
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }
    public function responderError(string $mensaje, int $statusCode = 400): void{
        $this->responder(['error' => $mensaje], $statusCode);
    }
}  