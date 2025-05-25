<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Jornada;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class JornadaController extends BaseController {
    private Jornada $jornada;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->jornada = new Jornada($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function obtenerTodasLasJornadas(): void {
        $jornadas = $this->jornada->obtenerTodasLasJornadas();
        $this->jsonResponseService->responder(['Jornadas' => $jornadas]);
    }

    public function obtenerJornadas(): void {
        $num_doc = $this->tokenService->validarToken();
        $jornadas = $this->jornada->obtenerJornadas($num_doc);
        $this->jsonResponseService->responder(['Jornadas' => $jornadas]);
    }

    public function corroborarJornada(array $data): void {
        if (!$this->parametrosRequeridos($data, ['data' => ['idJornada']])) {
            return;
        }
        $resultado = $this->jornada->corroborarJornada($data['data']['idJornada']);
        $this->jsonResponseService->responder(['JornadaCorroborada' => $resultado]);
    }

    public function noCorroborarJornada(array $data): void {
        if (!$this->parametrosRequeridos($data, ['data' => ['idJornada']])) {
            return;
        }
        $resultado = $this->jornada->noCorroborarJornada($data['data']['idJornada']);
        $this->jsonResponseService->responder(['JornadaNoCorroborada' => $resultado]);
    }

    public function finalizarJornada(array $data): void {
        try {
            $num_doc = $this->tokenService->validarToken();

            if (!$this->parametrosRequeridos($data['data'], ['fechaBogota'])) {
                $this->jsonResponseService->responderError("Faltan parámetros requeridos.");
                return;
            }
            

            $fecha = $data['data']['fechaBogota'];
            $resultado = $this->jornada->finalizarJornada($fecha, (int)$num_doc);

            $this->jsonResponseService->responder(['JornadaFinalizada' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError("Error: " . $e->getMessage());
        }
    }
}


