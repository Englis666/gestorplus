<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Auth;
use Service\AntiAttackForce;
use Predis\Client as RedisClient;
use Service\TokenService;
use Exception;
use Firebase\JWT\JWT;

class AuthController extends BaseController{
    private Auth $auth;
    private TokenService $tokenService;
    private AntiAttackForce $antiAttackForce;

    public function __construct() {
        parent::__construct();
        $this->auth = new Auth($this->dbService);
        $this->tokenService = new TokenService();

        $redis = new RedisClient([
            'scheme' => 'tcp',
            'host' => 'gestorplus-redis',
            'port' => 6379
        ]);
        $this->antiAttackForce = new AntiAttackForce($redis);

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
        $this->antiAttackForce->detectSuspiciousUserAgent();
        if (empty($data['num_doc']) || empty($data['password'])) {
            $this->jsonResponseService->responder(['status' => 'error', 'message' => 'Número de documento y contraseña son requeridos'], 400);
            return;
        }
        $num_doc = trim($data['num_doc']);
        $password = trim($data['password']);

        $this->antiAttackForce->checkLoginAttempts($num_doc);

        $usuario = $this->auth->inicioSesion(['num_doc' => $num_doc, 'password' => $password]);
        $loginSuccess = (bool)$usuario;

        $this->antiAttackForce->registerLoginAttempt($num_doc, $loginSuccess);

        if (!$loginSuccess) {
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
    
        
        
        $this->jsonResponseService->responder([
            'status' => 'success', 
            'message' => 'Credenciales correctas', 
            'data' => ['token' => $token]
        ]);
    }

    public function recuperarPassword($data) {
        if (empty($data['email'])) {
            $this->jsonResponseService->responderError('El correo es requerido');
            return;
        }
    
        $email = trim($data['email']);
    
        $usuario = $this->auth->buscarPorCorreo($email);
        if (!$usuario) {
            $this->jsonResponseService->responderError('Correo electronico no registrado');
            return;
        }
    
        $token = bin2hex(random_bytes(32));
        $expira = time() + 3600;
    
        $this->auth->guardarTokenRecuperacion($email, $token, $expira);
    
        $enlace = "http://localhost:3000/RestablecerPassword?token=$token";
    
        $mensaje = "Hola {$usuario['nombres']},<br>Haz clic en el siguiente enlace para restablecer tu contraseña:<br><a href=\"$enlace\">Recuperar contraseña</a>";
    
        if (\Service\Mailer::enviarCorreo($email, 'Recuperación de contraseña', $mensaje)) {
            $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Se ha enviado un correo para recuperar tu contraseña']);
        } else {
            $this->jsonResponseService->responderError(['status' => 'error', 'message' => 'Error al enviar el correo'], 500);
        }
    }

    public function restablecerPassword($data) {
        if (empty($data['token']) || empty($data['password'])) {
            $this->jsonResponseService->responderError('Token y nueva contraseña son requeridos');
            return;
        }
    
        $token = $data['token'];
        $newPass = $data['password'];
    
        $fila = $this->auth->validarToken($token);
        if (!$fila) {
            $this->jsonResponseService->responderError('Token inválido o expirado', 400);
            return;
        }
    
        $hash = password_hash($newPass, PASSWORD_BCRYPT);
    
        $actualizado = $this->auth->actualizarPassword($fila['usuario_num_doc'], $hash);
        if (!$actualizado) {
            $this->jsonResponseService->responderError('Error al actualizar contraseña', 500);
            return;
        }
    
        $this->auth->marcarTokenUsado((int)$fila['idPasswordReset']);
    
        $this->jsonResponseService->responder(['status'=>'success','message'=>'Contraseña restablecida']);
    }
    

}
    