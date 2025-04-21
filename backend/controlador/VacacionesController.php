<?php
declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Vacaciones;
use Servicio\TokenService;
use PDO;

class VacacionesController extends BaseController {
    private PDO $db;
    private Vacaciones $vacaciones;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->vacaciones = new Vacaciones($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerTodasLasVacaciones(): void {
        $vacaciones = $this->vacaciones->obtenerTodasLasVacaciones();
        $this->jsonResponseService->responder(['Vacaciones' => $vacaciones]);
    }

    public function obtenerMisVacaciones(): void {
        $num_doc = (int) $this->tokenService->validarToken();
        $vacaciones = $this->vacaciones->obtenerMisVacaciones($num_doc);
        $this->jsonResponseService->responder(['Vacaciones' => $vacaciones]);
    }

    public function solicitarVacaciones(array $data): void {
        $num_doc = $this->tokenService->validarToken();
        $mensaje = $this->vacaciones->solicitarVacaciones($num_doc, $data)
            ? 'Vacaciones solicitadas'
            : 'Error al solicitar las vacaciones';
        $this->jsonResponseService->responder(['message' => $mensaje]);
    }
}
