<?php
declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\PazySalvo;
use Servicio\TokenService;
use PDO;
use Exception;

class PazySalvoController extends BaseController
{
    private PazySalvo $pazysalvo;
    private PDO $db;
    private TokenService $tokenService;

    public function __construct()
    {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->pazysalvo = new PazySalvo($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerPazYSalvos(): void
    {
        try {
            $salvos = $this->pazysalvo->obtenerPazYSalvos();
            $this->jsonResponseService->responder(['Salvos' => $salvos]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => 'Error al obtener Paz y Salvos'], 500);
        }
    }

    public function obtenerMipazYSalvo(): void
    {
        try {
            $num_doc = $this->tokenService->validarToken();
            $salvos = $this->pazysalvo->obtenerMipazYSalvo($num_doc);
            $this->jsonResponseService->responder(['Salvos' => $salvos]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => 'Error al obtener el Paz y Salvo'], 500);
        }
    }
}
