<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Convocatoria;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class ConvocatoriaController extends BaseController{
    private Convocatoria $convocatoria;
    private TokenService $tokenService;

    public function __construct($convocatoria = null, $tokenService = null)
    {
        parent::__construct();
        $this->convocatoria = $convocatoria ?? new Convocatoria($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    public function agregarConvocatoria(array $data): void
    {
        $required = [
            'nombreConvocatoria',
            'descripcion',
            'requisitos',
            'salario',
            'cantidadConvocatoria',
            'idcargo'
        ];

        if (!$this->parametrosRequeridos($data, $required)) {
            return; 
        }

        $resultado = $this->convocatoria->agregarConvocatoria($data);
        $this->jsonResponseService->responder(['Convocatoria' => $resultado]);
    }

    public function obtenerConvocatorias(): void
    {
        $convocatorias = $this->convocatoria->obtenerConvocatorias();
        $this->jsonResponseService->responder(['convocatorias' => $convocatorias]);
    }

    public function obtenerDetalleConvocatoria(): void{
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;

        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError(json_encode(['error' => "No se encontró la convocatoria"]), 400);
            return;
        }

        try {
            $detalleConvocatoria = $this->convocatoria->obtenerDetalleConvocatoria((int)$idconvocatoria);
            if (!$detalleConvocatoria) {
                $this->jsonResponseService->responderError(json_encode([
                    'message' => "No se encontraron detalles para esta convocatoria",
                    'data' => []
                ]), 404);
                return;
            }

            $this->jsonResponseService->responder([
                'message' => 'DetalleConvocatoria',
                'data' => $detalleConvocatoria
            ]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError(json_encode([
                'error' => $e->getMessage()
            ]), $e->getCode() ?: 500);
        }
    }
    public function activarConvocatoria($data): void{
        $required = ['idconvocatoria'];

        if(!this->parametrosRequeridos($data, $required)){
            return;
        }

        $resultado = $this->convocatoria->activarConvocatoria($data['idconvocatoria']);
        if ($resultado){
            $this->jsonResponseService->responder(['success' => true, 'message' => 'Convocatoria Activada Correctamente']);
        } else {
            $this->jsonResponseService->responderError(json_encode(['error' => 'No se pudo activar la convocatoria']), 500);
            return;
        }
    }

    public function desactivarConvocatoria($data): void{
        $required = ['idconvocatoria'];

        if(!this->parametrosRequeridos($data, $required)){
            return;
        }
        $resultado = $this->convocatoria->desactivarConvocatoria($data['idconvocatoria']);
        if ($resultado){
            $this->jsonResponseService->responder(['success' => true, 'message' => 'Convocatoria Desactivada Correctamente']);
        } else {
            $this->jsonResponseService->responderError(json_encode(['error' => 'No se pudo desactivar la convocatoria']), 500);
            return;
        }
    }

}
