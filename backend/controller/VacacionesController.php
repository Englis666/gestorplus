<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);
namespace Controller;
use Core\Controllers\BaseController;
use Service\TokenService;
use Model\Vacaciones;

class VacacionesController extends BaseController {
    private Vacaciones $vacaciones;
    private TokenService $tokenService;

    public function __construct($vacaciones = null, $tokenService = null) {
        parent::__construct();
        $this->vacaciones = $vacaciones ?? new Vacaciones($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
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
        $num_doc = (int) $this->tokenService->validarToken();
        $mensaje = $this->vacaciones->solicitarVacaciones($num_doc, $data)
            ? 'Vacaciones solicitadas'
            : 'Error al solicitar las vacaciones';
        $this->jsonResponseService->responder(['message' => $mensaje]);
    }

    public function aceptarVacacion(array $data): void {
        $idvacacion = $data['idvacacion'];
        $vacaciones = $this->vacaciones->aceptarVacacion($idvacacion);
        $this->jsonResponseService->responder(['vacacionAceptada' => $vacaciones]);
    }

    public function rechazarVacacion(array $data): void {
        $idvacacion = $data['idvacacion']; 
        $vacaciones = $this->vacaciones->rechazarVacacion($idvacacion);
        $this->jsonResponseService->responder(['vacacionRechazada' => $vacaciones]);
    }


}
