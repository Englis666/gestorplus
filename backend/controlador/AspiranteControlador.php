<?php

declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Aspirante;
use Servicio\TokenService;
use PDO;
use Exception;

class AspiranteControlador extends BaseController {
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

        if(!$this->parametrosRequeridos($data,['idconvocatoria'])){
            return;
        }
        $idconvocatoria = $this->getIntParam($data, 'idconvocatoria');
        try {
            $resultado = $this->aspirante->aplicacionDeAspirante($num_doc, $idconvocatoria);
            if (!$resultado) {
                $this->jsonResponseService->responderError(['error' => 'No se pudo completar la aplicación'], 500);
                return;
            }
            $this->jsonResponseService->responder(['message' => 'success', 'data' => true]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError(['error' => $e->getMessage()], $e->getCode());
        }
    }
}