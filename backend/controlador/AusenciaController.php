<?php
declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Ausencia;
use Servicio\TokenService;
use PDO;
use Exception;

class AusenciaController extends BaseController{
    private PDO $db;
    private Ausencia $ausencia;
    private TokenService $tokenService;

    public function __construct()
    {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->ausencia = new Ausencia($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerTodasLasAusencias(): void
    {
        $ausencias = $this->ausencia->obtenerTodasLasAusencias();
        $this->jsonResponseService->responder(['Ausencias' => $ausencias]);
    }

    public function obtenerAusencias(): void
    {
        try {
            $num_doc = $this->tokenService->validarToken();
            $ausencias = $this->ausencia->obtenerAusencias($num_doc);
            $this->jsonResponseService->responder(['Ausencias' => $ausencias]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function solicitarAusencia(array $data): void
    {
        try {
            $num_doc = $this->tokenService->validarToken();
            $this->ausencia->solicitarAusencia($num_doc, $data);
            $this->jsonResponseService->responder(['mensaje' => 'Solicitud de ausencia registrada exitosamente']);

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function asistenciaConfirmada(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['identrevista'])) {
            return;
        }
        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->ausencia->asistenciaConfirmada($identrevista);
        $this->jsonResponseService->responder(['AsistenciaConfirmada' => $resultado]);
    }

    public function asistenciaNoConfirmada(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['identrevista'])) {
            return;
        }

        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->ausencia->asistenciaNoConfirmada($identrevista);
        $this->jsonResponseService->responder(['AsistenciaNoConfirmada' => $resultado]);
    }
}