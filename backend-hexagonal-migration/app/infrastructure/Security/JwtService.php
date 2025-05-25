<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Infrastructure\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class jwtService{
    private string $secretKey;
    private string $algo;

    public function __construct(string $secretKey, string $algo){
        $this->secretKey = $secretKey;
        $this->algo = $algo;
    }

    public function generarToken(array $payload): string{
        return JWT::encode($payload, $this->secretKey, $this->algo);
    }

    public function validarToken(string $token): ?object{
        try{
            return JWT::decode($token, new Key($this->secretKey, $this->algo));
        } catch (\Exception $e){
            return null;
        }
    }


}
