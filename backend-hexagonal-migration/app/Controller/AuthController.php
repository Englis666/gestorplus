<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace App\Controller;

use App\Service\AuthService;
use App\DTO\LoginRequestDTO;
use App\DTO\RegisterRequestDTO;
use Infrastructure\Security\JwtService;
use Shared\Response\JsonResponse;
use Config\Clave;

class AuthController {
    private AuthService $authService;
    private JwtService $jwtService;

    public function __construct() {
        $this->authService = new AuthService();
        $this->jwtService = new JwtService(Clave::SECRET_KEY, Clave::JWT_ALGO);
    }

    public function registrar(array $data): void {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['estado'] = 1;
        $data['rol_idrol'] = 4;

        $registerDTO = new RegisterRequestDTO($data['num_doc'], $data['password'], $data['estado'], $data['rol_idrol']);
        $resultado = $this->authService->registrar((array) $registerDTO);

        JsonResponse::success(['message' => $resultado]);
    }

    public function iniciar(array $data): void {
        if (empty($data['num_doc']) || empty($data['password'])) {
            JsonResponse::error('Número de documento y contraseña son requeridos', 400);
            return;
        }

        $loginDTO = new LoginRequestDTO($data['num_doc'], $data['password']);
        $usuario = $this->authService->inicioSesion($loginDTO->num_doc, $loginDTO->password);

        if (!$usuario) {
            JsonResponse::error('Credenciales incorrectas', 401);
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
                'rol' => (string)$usuario['rol'],
                'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
            ]
        ];

        $token = $this->jwtService->generarToken($payload);

        JsonResponse::success(['token' => $token, 'message' => 'Credenciales correctas']);
    }
}
