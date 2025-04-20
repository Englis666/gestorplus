<?php
declare(strict_types =1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\PazySalvo;
use Servicio\TokenService;
use PDO;
use Exception;

class PazySalvoController extends BaseController{
    private PazySalvo $pazysalvo;
    private PDO $db; 
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->pazysalvo = new PazySalvo($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerPazYSalvos(): void
    {
        $this->jsonResponseService->responder(['Salvos' => $this->pazysalvo->obtenerPazYSalvos()]);
    }

    public function obtenerMipazYSalvo(): void{
        $num_doc = $this->tokenService->validarToken();
        $this->responder('Salvos', $this->empleado->obtenerMipazYSalvo($num_doc));
    }

}