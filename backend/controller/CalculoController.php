<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Calculo;
use Service\TokenService;
use Exception;

class CalculoController extends BaseController {
    private Calculo $calculo;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->calculo = new Calculo($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function calcularPostulacionesEnConvocatorias(): void {
        try {
            $resultado = $this->calculo->calcularPostulacionesEnConvocatorias();
            $this->jsonResponseService->responder(['convocatorias' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

    public function calcularHorasExtra(): void {
        try {
            $resultado = $this->calculo->calcularHorasExtra();
            $this->jsonResponseService->responder(['calculo' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

    public function obtenerMinutosTrabajados(): void {
        try {
            $num_doc = $this->tokenService->obtenerToken(); 
            $resultado = $this->calculo->obtenerMinutosTrabajados($num_doc);
            $this->jsonResponseService->responder(['minutosTrabajados' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

    public function obtenerMinutosTrabajadosDelEmpleado(): void {
        try {
            $resultado = $this->calculo->obtenerMinutosTrabajadosDelEmpleado();
            $this->jsonResponseService->responder(['minutosTrabajados' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }
}
