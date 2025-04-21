<?php
declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Jornada;
use Servicio\TokenService;
use PDO;
use Exception;

class JornadaController extends BaseController {

    private PDO $db;
    private Jornada $jornada;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->jornada = new Jornada($this->db);
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
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idJornada']])) {
            return;
        }
        $resultado = $this->jornada->corroborarJornada($data['data']['idJornada']);
        $this->jsonResponseService->responder(['JornadaCorroborada' => $resultado]);
    }

    public function noCorroborarJornada(array $data): void {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idJornada']])) {
            return;
        }
        $resultado = $this->jornada->noCorroborarJornada($data['data']['idJornada']);
        $this->jsonResponseService->responder(['JornadaNoCorroborada' => $resultado]);
    }
}

