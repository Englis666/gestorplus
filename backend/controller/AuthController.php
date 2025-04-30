<?php
declare(strict_types = 1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Auth;
use Service\TokenService;
use PDO;
use Exception;
use Firebase\JWT\JWT;

class AuthController extends BaseController{
    private PDO $db;
    private Auth $auth;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->auth = new Auth($this->db);
        $this->tokenService = new TokenService();
    }

    private function verificarToken(): ?object {
        try {
            $token = $this->tokenService->obtenerToken();
            return $this->tokenService->obtenerPayload();
        } catch (\Exception $e) {
            $this->jsonResponseService->responder(['status' => 'error', 'message' => $e->getMessage()], $e->getCode());
            return null;
        }
    }
 
    public function registrar($data) {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['estado'] = 1;
        $data['rol_idrol'] = 4;

        $resultado = $this->auth->registrar($data);
        $this->jsonResponseService->responder(['status' => 'success', 'message' => $resultado]);
    }

    public function iniciar($data) {
        if (empty($data['num_doc']) || empty($data['password'])) {
            $this->jsonResponseService->responder(['status' => 'error', 'message' => 'Número de documento y contraseña son requeridos'], 400);
            return;
        }
    
        $usuario = $this->auth->inicioSesion(['num_doc' => trim($data['num_doc']), 'password' => trim($data['password'])]);
        if (!$usuario) {
            $this->jsonResponseService->responder(['status' => 'error', 'message' => 'Credenciales incorrectas'], 401);
            return;
        }
    
        $payload = [
            'iss' => '/',
            'aud' => 'localhost,192.168.194.70',
            'iat' => time(),
            'exp' => time() + 3600,
            'data' => [
                'num_doc' => $usuario['num_doc'],
                'nombres' => $usuario['nombres'],
                'rol' => (string) $usuario['rol'],
                'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
            ]
        ];
    
        $token = JWT::encode($payload, \Config\Clave::SECRET_KEY, \Config\Clave::JWT_ALGO);
    
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        
        $this->jsonResponseService->responder([
            'status' => 'success', 
            'message' => 'Credenciales correctas', 
            'data' => ['token' => $token]
        ]);
    }
    
}