<?php
declare(strict_types=1);
namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Cargo;
use Servicio\TokenService;
use PDO;
use Exception;

class CargoController extends BaseController {
    private Cargo $cargo;
    private PDO $db;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->cargo = new Cargo($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerCargos(){
        $this->responder(['cargos' => $this->cargo->obtenerCargos()]);
    }

    public function agregarCargo(array $data)
    {
        if (!$this->parametrosrequeridos($data, ['nombreCargo'])) {
            return;
        }
        $resultado = $this->cargo->agregarCargo($data['nombreCargo']);
        $this->responder(['success' => true, 'cargo' => $resultado]);
    }

}