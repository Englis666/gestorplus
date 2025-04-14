<?php
namespace Controlador;

use Modelo\Publicaciones;
use Config\Database;
use Config\Clave;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class PublicacionesControlador{
    private $db;
    private $publicaciones;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->publicaciones = new Publicaciones($this->db);
    }

    public function jsonResponse($data, $status = 200){
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    protected function obtenerToken(): string {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
            $this->jsonResponse(['error' => 'Token no proporcionado o formato incorrecto'], 401);
        }

        return $matches[1];
    }

    protected function validarToken(): string {
        $token = $this->obtenerToken();

        try {
            return JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO))->data->num_doc;
        } catch (\Firebase\JWT\ExpiredException $e) {
            $this->jsonResponse(['error' => 'Token expirado'], 401);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            $this->jsonResponse(['error' => 'Token con firma inválida'], 403);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Error al procesar el token: ' . $e->getMessage()], 400);
        }
    }

    private function responder(string $clave, $resultado): void {
        $this->jsonResponse([$clave => $resultado ?: []]);
    }

    public function obtenerPublicacionPorTipoDeContrato(){
        $num_doc = $this->validarToken();
        $this->responder('Publicaciones', $this->publicaciones->obtenerPublicacionPorTipoDeContrato($num_doc));
    }


}