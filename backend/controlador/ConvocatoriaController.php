<?php
declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Convocatoria;
use Servicio\TokenService;
use Servicio\ValidationService;
use PDO;
use Exception;

class ConvocatoriaController extends BaseController
{
    private PDO $db;
    private Convocatoria $convocatoria;
    private TokenService $tokenService;
    private ValidationService $validationService;

    public function __construct()
    {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->convocatoria = new Convocatoria($this->db);
        $this->tokenService = new TokenService();
        $this->validationService = new ValidationService();
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

        if (!$this->validationService->verificarDatosRequeridos($data, $required)) {
            return; // Ya responde desde el servicio
        }

        $resultado = $this->convocatoria->agregarConvocatoria($data);
        $this->jsonResponseService->responder(['Convocatoria' => $resultado]);
    }

    public function obtenerConvocatorias(): void
    {
        $convocatorias = $this->convocatoria->obtenerConvocatorias();
        $this->jsonResponseService->responder(['convocatorias' => $convocatorias]);
    }

    public function obtenerDetalleConvocatoria(): void
    {
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;

        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError(['error' => "No se encontró la convocatoria"], 400);
            return;
        }

        try {
            $detalleConvocatoria = $this->convocatoria->obtenerDetalleConvocatoria((int)$idconvocatoria);
            if (!$detalleConvocatoria) {
                $this->jsonResponseService->responderError([
                    'message' => "No se encontraron detalles para esta convocatoria",
                    'data' => []
                ], 404);
                return;
            }

            $this->jsonResponseService->responder([
                'message' => 'DetalleConvocatoria',
                'data' => $detalleConvocatoria
            ]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError([
                'error' => $e->getMessage()
            ], $e->getCode() ?: 500);
        }
    }
}
