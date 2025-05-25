<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace App\Service;

use Domain\Repository\AuthRepositoryInterface;
use Infrastructure\Repository\AuthRepository;

class AuthService {
    private AuthRepositoryInterface $authRepository;

    public function __construct(?AuthRepositoryInterface $repo = null) {
        $this->authRepository = $repo ?? new AuthRepository();
    }

    public function registrar(array $data): string {
        return $this->authRepository->registrar($data);
    }

    public function inicioSesion(string $num_doc, string $password): ?array {
        $usuario = $this->authRepository->buscarUsuarioPorNumDoc($num_doc);
        if ($usuario && password_verify($password, $usuario['password'])) {
            return $usuario;
        }
        return null;
    }
}
