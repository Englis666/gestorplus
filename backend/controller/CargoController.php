<?php
declare(strict_types=1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Cargo;
use Service\TokenService;
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
        $this->jsonResponseService->responder(['cargos' => $this->cargo->obtenerCargos()]);
    }

    public function agregarCargo(array $data)
    {
        if (!$this->parametrosrequeridos($data, ['nombreCargo'])) {
            return;
        }
        $resultado = $this->cargo->agregarCargo($data['nombreCargo']);
        $this->jsonResponseService->responder(['success' => true, 'cargo' => $resultado]);
    }
    
    public function activarCargo(array $data){
        if(!$this->parametrosrequeridos($data, ['idCargo'])){
            return; 
        }
    
        $resultado = $this->cargo->activarCargo((int) $data['idCargo']);
        $this->jsonResponseService->responder(['success' => true, 'cargo' => $resultado]);
    }
    
    public function desactivarCargo(array $data){
        if(!$this->parametrosrequeridos($data, ['idCargo'])){
            return;
        }
    
        try {
            $resultado = $this->cargo->desactivarCargo((int) $data['idCargo']);
            $this->jsonResponseService->responder(['success' => true, 'cargo' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => $e->getMessage()], 400);
        }
    }
    
    

}