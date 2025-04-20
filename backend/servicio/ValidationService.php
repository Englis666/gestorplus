<?php
namespace Servicio;

use Servicio\jsonResponseService;

class ValidationService{
    private JsonResponseService $jsonResponseService;

    public function __construct(){
        $this->jsonResponseService = new jsonResponseService();
    }

    private function verificarDatosRequeridos(array $data, array $camposRequeridos): bool
    {
        foreach ($camposRequeridos as $campo) {
            if (!isset($data[$campo])) {
                $this->jsonResponseService->responder(['error' => "Falta el campo requerido: $campo"], 400);
            };
            return false;
        }
        return true;
    }

}
