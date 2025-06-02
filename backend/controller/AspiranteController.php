<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Aspirante;
use Service\TokenService;
use Exception;

class AspiranteController extends BaseController {
    private Aspirante $aspirante;
    private TokenService $tokenService;

    public function __construct($aspirante = null, $tokenService = null) {
        parent::__construct();
        $this->aspirante = $aspirante ?? new Aspirante($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }
    
    public function aplicacionDeAspirante($data) {
        $num_doc = $this->tokenService->validarToken();
        if ($num_doc === null){
            $this->jsonResponseService->responderError('Token Invalido', 401);
            return;
        }
        if(!$this->parametrosRequeridos($data, ['idconvocatoria'])){
            return;
        }
        $idconvocatoria = $this->getIntParam($data, 'idconvocatoria');
        try {
            $resultado = $this->aspirante->aplicacionDeAspirante($num_doc, $idconvocatoria);
            if (!$resultado) {
                $this->jsonResponseService->responderError('No se pudo completar la aplicación', 500);
                return;
            }
            $this->jsonResponseService->responder(['message' => 'success', 'data' => true]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError('Error: ' . $e->getMessage(), $e->getCode());
        }
    }
}
