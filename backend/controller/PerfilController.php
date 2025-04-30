<?php
declare(strict_types = 1);
namespace Controlador;

use Core\Controllers\BaseController;
use Model\Perfil;
use Service\TokenService;
use PDO;
use Exception;

class PerfilController extends BaseController {
    private PDO $db;
    private Perfil $perfil;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->perfil = new Perfil($this->db);
        $this->tokenService = new TokenService();
    }

    public function datosPerfil() {
        try {
            $num_doc = $this->tokenService->validarToken();
            $resultado = $this->perfil->datosPerfil($num_doc);
            $this->jsonResponseService->responder(['status' => 'success', 'message' => '', 'data' => $resultado]);
        } catch (\Exception $e) {
            $errorData = json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            $this->jsonResponseService->responderError($errorData, $e->getCode());
        }
    }
    

    public function actualizarPerfil($data) {
        try {
            $num_doc = $this->tokenService->validarToken();
    
            if (empty($data['nombres']) || empty($data['apellidos']) || empty($data['email']) || empty($data['tipodDoc'])) {
                $this->jsonResponseService->responderError(['status' => 'error', 'message' => 'Faltan datos requeridos para actualizar el perfil'], 400);
                return;
            }
    
            $resultado = $this->perfil->actualizarPerfil($num_doc, $data);
            $this->jsonResponseService->responder(['status' => $resultado ? 'success' : 'error', 'message' => $resultado ? 'Perfil actualizado correctamente' : 'No se pudo actualizar el perfil']);
        } catch (\Exception $e) {
            $this->jsonResponseService->responderError(['status' => 'error', 'message' => $e->getMessage()], $e->getCode());
        }
    }
   
}