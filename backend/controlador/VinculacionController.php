<?php
declare(strict_types = 1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Vinculacion;
use Servicio\TokenService;
use PDO;
use Exception;

class VinculacionController extends BaseController {
    private PDO $db;
    private Vinculacion $vinculacion;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->vinculacion = new Vinculacion($this->db);
        $this->tokenService = new TokenService();
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
