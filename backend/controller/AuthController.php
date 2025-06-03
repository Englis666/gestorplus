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
    protected Auth $auth;
    protected TokenService $tokenService;
    protected AntiAttackForce $antiAttackForce;

    public function __construct($auth = null, $tokenService = null, $antiAttackForce = null) {
        parent::__construct();
        $this->auth = $auth ?? new Auth($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
        $this->antiAttackForce = $antiAttackForce ?? new AntiAttackForce(
            new RedisClient([
                'scheme' => 'tcp',
                'host' => 'gestorplus-redis',
                'port' => 6379
            ])
        );

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
 
    /**
     * @OA\Post(
     *     path="/auth/registrar",
     *     tags={"Auth"},
     *     summary="Registrar usuario",
     *     description="Registra un nuevo usuario en el sistema.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"num_doc", "nombres", "apellidos", "email", "password"},
     *             @OA\Property(property="num_doc", type="integer", example=1014736),
     *             @OA\Property(property="nombres", type="string", example="Juan"),
     *             @OA\Property(property="apellidos", type="string", example="Pérez"),
     *             @OA\Property(property="email", type="string", example="juan@email.com"),
     *             @OA\Property(property="password", type="string", example="123456")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuario registrado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Usuario registrado correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Datos inválidos o faltantes"
     *     )
     * )
     */
    public function registrar($data) {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['estado'] = 1;
        $data['rol_idrol'] = 4;

        $resultado = $this->auth->registrar($data);
        $this->jsonResponseService->responder(['status' => 'success', 'message' => $resultado]);
    }

    /**
     * @OA\Post(
     *     path="/auth/iniciar",
     *     tags={"Auth"},
     *     summary="Iniciar sesión",
     *     description="Inicia sesión y retorna un token JWT si las credenciales son correctas.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"num_doc", "password"},
     *             @OA\Property(property="num_doc", type="integer", example=1014736),
     *             @OA\Property(property="password", type="string", example="123456")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Inicio de sesión exitoso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Credenciales correctas"),
     *             @OA\Property(property="data", type="object", @OA\Property(property="token", type="string", example="jwt.token.aqui"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Credenciales incorrectas"
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/auth/recuperar-password",
     *     tags={"Auth"},
     *     summary="Recuperar contraseña",
     *     description="Envía un correo para recuperar la contraseña del usuario.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", example="juan@email.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Correo de recuperación enviado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Se ha enviado un correo para recuperar tu contraseña")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="El correo es requerido o no registrado"
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/auth/restablecer-password",
     *     tags={"Auth"},
     *     summary="Restablecer contraseña",
     *     description="Permite restablecer la contraseña usando un token de recuperación.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"token", "password"},
     *             @OA\Property(property="token", type="string", example="token_de_recuperacion"),
     *             @OA\Property(property="password", type="string", example="nueva_contraseña")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contraseña restablecida",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Contraseña restablecida")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Token o nueva contraseña requeridos, o token inválido"
     *     )
     * )
     */
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
