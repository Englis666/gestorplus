<?php
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

    public function finalizarJornada(): void {
        $num_doc = $this->tokenService->validarToken();
        $mensaje = $this->empleado->finalizarJornada($num_doc)
            ? 'Jornada finalizada'
            : 'Error al finalizar la jornada';
        $this->jsonResponseService->responder(['message' => $mensaje]);
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
}

