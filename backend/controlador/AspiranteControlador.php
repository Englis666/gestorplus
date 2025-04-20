<?php
namespace Controlador;

use Config\DataBase;
use Modelo\Aspirante;
use Exception;
use Servicio\jsonResponseService;
use Servicio\TokenService;

class AspiranteControlador {
    private Database $db;
    private Aspirante $aspirante;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct() {
        $this->db = new Database();
        $this->aspirante = new Aspirante($this->db->getConnection());
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new JsonResponseService();
    }

    protected function validarToken(): ?string{
        try {
            return $this->tokenService->validarToken();
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => $e->getMessage()], $e->getCode());
            return null;
        }
    }

    protected function obtenerNumDocDesdeToken(): ?string {
        $token = $this->validarToken();
        if($token === null){
            return null;
        }
        return $token;
    }


    
    public function aplicacionDeAspirante($data) {
        $num_doc = $this->obtenerNumDocDesdeToken();
        if ($num_doc === null) return;
        $idconvocatoria = $data['idconvocatoria'] ?? null;

        if (!$idconvocatoria) {
            $this->jsonResponseSerivce->responder(['error' => 'Datos insuficientes'], 400);
            return;
        }

        try {
            $resultado = $this->aspirante->aplicacionDeAspirante($num_doc, $idconvocatoria);
            if (!$resultado) {
                $this->jsonResponseService->responder(['error' => 'No se pudo completar la aplicación'], 500);
                return;
            }
            $this->jsonResponseService->responder(['message' => 'success', 'data' => true]);
        } catch (Exception $e) {
            $this->responder(['error' => $e->getMessage()], $e->getCode());
        }
    }
}