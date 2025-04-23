<?php
declare(strict_types = 1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Calculo;
use Servicio\TokenService;
use PDO;
use Exception;

class CalculoControlador extends BaseController {
    private PDO $db;
    private Calculo $calculo;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->calculo = new Calculo($this->db);
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
            $num_doc = $this->obtenerNumDocDesdeToken(); 
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
