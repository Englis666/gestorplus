<?php

namespace Servicio;
use Config\Clave;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class TokenService{

    public function obtenerToken(): string{
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
            throw new Exception('Token no proporcionado o formato incorrecto', 401);
        }

        return $matches[1];
    }

    public function validarToken(): string{
        $token = $this->obtenerToken();
        try {
            return JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO))->data->num_doc;
        } catch (\Firebase\JWT\ExpiredException $e){
            throw new Exception('Token expirado', 401);
        } catch (\Firebase\JWT\SignatureInvalidException $e){
            throw new Exception('Token con firma invalida', 403);
        } catch (Exception $e){
            throw new Exception('Error al procesar el token: ' .$e->getMessage(), 400);
        }
    }

    public function obtenerPayload(): ?object {
        $token = $this->obtenerToken();
        try {
            return JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
        } catch (Exception $e) {
            return null; 
        }
    }
}