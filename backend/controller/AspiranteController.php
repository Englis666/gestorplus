<?php

declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Aspirante;
use Service\TokenService;
use PDO;
use Exception;

class AspiranteController extends BaseController {
    private PDO $db;
    private Aspirante $aspirante;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->aspirante = new Aspirante($this->db);
        $this->tokenService = new TokenService();
    }
    
    
    public function aplicacionDeAspirante($data) {
        $num_doc = $this->tokenService->validarToken();
        if ($num_doc === null) return;

        if(!$this->parametrosRequeridos($data, ['idconvocatoria'])){
            return;
        }
        $idconvocatoria = $this->getIntParam($data, 'idconvocatoria');
        try {
            $resultado = $this->aspirante->aplicacionDeAspirante($num_doc, $idconvocatoria);
            if (!$resultado) {
                // Cambio aquí para pasar un string como mensaje
                $this->jsonResponseService->responderError('No se pudo completar la aplicación', 500);
                return;
            }
            $this->jsonResponseService->responder(['message' => 'success', 'data' => true]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError('Error: ' . $e->getMessage(), $e->getCode());
        }
    }
}
