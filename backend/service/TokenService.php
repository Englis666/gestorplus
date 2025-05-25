<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Service;

use Config\Clave;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class TokenService {

    // Método para obtener el token del encabezado de autorización
    public function obtenerToken(): string {
        // Intentamos obtener las cabeceras a través de $_SERVER si las funciones anteriores no están disponibles.
        $headers = $this->getHeaders();
        $authHeader = $headers['Authorization'] 
           ?? $_SERVER['HTTP_AUTHORIZATION'] 
           ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] 
           ?? null;

        if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
            throw new Exception('Token no proporcionado o formato incorrecto', 401);
        }

        return $matches[1];
    }

    // Método para obtener las cabeceras del servidor
    private function getHeaders(): array {
        if (function_exists('apache_request_headers')) {
            return apache_request_headers();
        }

        // Si apache_request_headers no está disponible, usamos $_SERVER
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (substr($key, 0, 5) === 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))))] = $value;
            }
        }

        return $headers;
    }

    // Método para validar el token
    public function validarToken(): string {
        $token = $this->obtenerToken();
        try {
            // Decodifica el token usando la clave secreta
            return JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO))->data->num_doc;
        } catch (\Firebase\JWT\ExpiredException $e){
            throw new Exception('Token expirado', 401);
        } catch (\Firebase\JWT\SignatureInvalidException $e){
            throw new Exception('Token con firma invalida', 403);
        } catch (Exception $e){
            throw new Exception('Error al procesar el token: ' .$e->getMessage(), 400);
        }
    }

    // Método para obtener el payload del token
    public function obtenerPayload(): ?object {
        $token = $this->obtenerToken();
        try {
            // Decodifica el token y obtiene el payload
            return JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
        } catch (Exception $e) {
            return null; 
        }
    }
}
