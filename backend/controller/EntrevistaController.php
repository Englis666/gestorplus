<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
namespace Controller;

use Core\Controllers\BaseController;
use Model\Entrevista;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class EntrevistaController extends BaseController{
    private Entrevista $entrevista; 
    private TokenService $tokenService;

    public function __construct($entrevista = null, $tokenService = null){
        parent::__construct();
        $this->entrevista = $entrevista ?? new Entrevista($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    public function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    public function asignarEntrevista(array $data)
    {
        $required = ['fecha', 'hora', 'lugarMedio'];
        if (!$this->parametrosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->entrevista->asignarEntrevista($data);
        $this->responder(['Entrevista' => $resultado]);
    }

    public function obtenerEntrevistas()
    {
        $this->responder(['Entrevista' => $this->entrevista->obtenerEntrevistas()]);
    }

    
    public function obtenerDatosDelEntrevistado(?string $num_doc = null)
    {
        $num_doc = $_GET['num_doc'] ?? $num_doc;
        $entrevistado = $this->entrevista->obtenerDatosDelEntrevistado($num_doc);
        $this->responder(["Entrevistado" => $entrevistado ?: ["error" => "No se encontraron datos para el documento proporcionado"]]);
    }

    public function asistenciaConfirmada(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['identrevista'])) {
            return;
        }
        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->entrevista->asistenciaConfirmada($identrevista);
        $this->jsonResponseService->responder(['AsistenciaConfirmada' => $resultado]);
    }

    public function asistenciaNoConfirmada(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['identrevista'])) {
            return;
        }

        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->entrevista->asistenciaNoConfirmada($identrevista);
        $this->jsonResponseService->responder(['AsistenciaNoConfirmada' => $resultado]);
    }


}