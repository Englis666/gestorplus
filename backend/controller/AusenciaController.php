<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Ausencia;
use Service\TokenService;
use Exception;

class AusenciaController extends BaseController {
    private Ausencia $ausencia;
    private TokenService $tokenService;

    public function __construct($ausencia = null, $tokenService = null) {
        parent::__construct();
        $this->ausencia = $ausencia ?? new Ausencia($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();  
    }

    public function obtenerTodasLasAusencias(): void {
        $ausencias = $this->ausencia->obtenerTodasLasAusencias();
        $this->jsonResponseService->responder(['Ausencias' => $ausencias]);
    }

    public function obtenerAusencias(): void {
        try {
            $num_doc = $this->tokenService->validarToken();
            $ausencias = $this->ausencia->obtenerAusencias($num_doc);
            $this->jsonResponseService->responder(['Ausencias' => $ausencias]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function solicitarAusencia(array $data): void {
        try {
            $num_doc = $this->tokenService->validarToken();
            $this->ausencia->solicitarAusencia($num_doc, $data);
            $this->jsonResponseService->responder(['mensaje' => 'Solicitud de ausencia registrada exitosamente']);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function ausenciaAceptada($data): void {
        if (isset($data['idausencia'])) {
            $idausencia = $data['idausencia'];
            $resultado = $this->ausencia->ausenciaAceptada($idausencia);
            $this->jsonResponseService->responder(['success' => $resultado]);
        } else {
            $this->jsonResponseService->responderError('ID de ausencia no recibido.');
        }
    }
    

    
    public function ausenciaRechazada($data): void {
        if (isset($data['idausencia'])) {
            $idausencia = $data['idausencia'];
            $resultado = $this->ausencia->ausenciaRechazada($idausencia);
            $this->jsonResponseService->responder(['success' => $resultado]);
        } else {
            $this->jsonResponseService->responderError('ID de ausencia no recibido.');
        }
    }
}
