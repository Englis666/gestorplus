<?php 
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Certificado;
use Service\TokenService;
use Exception;

class CertificadoController extends BaseController{
    private Certificado $certificado;
    private TokenService $tokenService;

   public function __construct()
    {
        parent::__construct();
        $this->certificado = New certificado($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function obtenerDatosParaCertificado(){
        try{
         $num_doc = $this->tokenService->validarToken();
         $certificado = $this->certificado->obtenerDatosParaCertificado($num_doc);
         $this->jsonResponseService->responder(['Certificado' => $certificado]);
        } catch (Exception $e){
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }


}