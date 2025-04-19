<?php

namespace Controlador;
use Modelo\Vacaciones;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class VacacionesController{
    private $db;
    private Vacaciones $vacaciones;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->vacaciones = new Vacaciones($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new JsonResponseService();
    }

    protected function validarToken(): ?string
    {
        try {
            return $this->tokenService->validarToken();
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => $e->getMessage()], $e->getCode());
            return null;
        }
    }
    protected function verificarToken(): void
    {
        if ($this->validarToken() === null) {
            exit;
        }
    }


    public function responder(array $data ,int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode); 
    }


    public function obtenerTodasLasVacaciones()
    {
        $this->responder($this->vacaciones->obtenerTodasLasVacaciones());
    }


    public function obtenerMisVacaciones(): void {
        $num_doc = $this->validarToken();
        $this->responder('Vacaciones', $this->empleado->obtenerMisVacaciones($num_doc));
    }

      
    public function solicitarVacaciones(array $data): void {
        $num_doc = $this->validarToken();
        $this->responder('message', $this->empleado->solicitarVacaciones($num_doc, $data) ? 'Vacaciones solicitadas' : 'Error al solicitar las vacaciones');
    }
    

    
}