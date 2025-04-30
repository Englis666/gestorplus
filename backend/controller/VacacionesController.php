<?php
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Vacaciones;
use Service\TokenService;
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

    public function aceptarVacacion(array $data): void{
        $vacaciones = $this->vacaciones->aceptarVacacion($idvacacion);
        $this->jsonResponseService->responder(['vacacionAceptada' => $vacaciones]);
    }

    public function rechazarVacacion(array $data): void{
        $vacaciones = $this->vacaciones->rechazarVacacion($idvacacion);
        $this->jsonResponseService->responder(['vacacionRechazada' => $vacaciones]);
    }

}
