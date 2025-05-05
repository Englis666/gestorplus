<?php
declare(strict_types = 1);
namespace Controller;
use Core\Controllers\BaseController;
use Model\Vinculacion;
use Exception;

class VinculacionController extends BaseController {
    private Vinculacion $vinculacion;

    public function __construct(){
        parent::__construct();
        $this->vinculacion = new Vinculacion($this->dbService);
    }

    public function asignarVinculacion(array $data): void {
        $required = ['num_doc', 'fechaInicio', 'fechaFin', 'tipoContrato', 'salario', 'estadoContrato', 'fechaFirma'];

        try {
            if (!$this->parametrosRequeridos($data, $required)) {
                $this->jsonResponseService->responderError('Datos requeridos incompletos', 422);
                return;
            }

            $resultado = $this->vinculacion->asignarVinculacion($data);
            $this->jsonResponseService->responder(['Vinculacion' => $resultado]);

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

    public function obtenerVinculaciones(): void {
        try {
            $resultado = $this->vinculacion->obtenerVinculaciones();
            $this->jsonResponseService->responder(['Vinculaciones' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }
}
