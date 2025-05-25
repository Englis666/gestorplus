<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Config;

class Clave {
    public const SECRET_KEY = self::getEnv('JWT_SECRET_KEY', 'default_secret_key');
    public const JWT_ALGO = self::getEnv('JWT_ALGO', 'HS256');

    private static function getEnv(string $key, string $default = ''): string {
        return getenv($key) ?: $default;
    }
}
