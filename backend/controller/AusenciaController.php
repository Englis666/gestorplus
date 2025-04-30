<?php
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Ausencia;
use Service\TokenService;
use PDO;
use Exception;

class AusenciaController extends BaseController {
    private PDO $db;
    private Ausencia $ausencia;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->ausencia = new Ausencia($this->db);
        $this->tokenService = new TokenService();
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
