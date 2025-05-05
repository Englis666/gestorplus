<?php

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

    public function __construct()
    {
        parent::__construct();
        $this->convocatoria = new Convocatoria($this->dbService);
        $this->tokenService = new TokenService();
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
    public function activarConvocatoria(): void{

    }
    public function desactivarConvocatoria(): void{
        
    }

}
