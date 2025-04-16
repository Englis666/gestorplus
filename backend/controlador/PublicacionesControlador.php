<?php
namespace Controlador;

use Modelo\Publicaciones;
use Config\Database;
use Config\Clave;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class PublicacionesControlador {
    private $db;
    private $publicaciones;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->publicaciones = new Publicaciones($this->db);
    }

    public function jsonResponse($data, $status = 200) {
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

    public function obtenerPublicacionPorTipoDeContrato() {
        $num_doc = $this->validarToken();
        $this->responder('Publicaciones', $this->publicaciones->obtenerPublicacionPorTipoDeContrato($num_doc));
    }

    public function agregarPublicacion($data) {
        $num_doc = $this->validarToken();
        
        if ($this->publicaciones->agregarPublicacion($data, $num_doc)) {
            $this->jsonResponse(['mensaje' => 'Publicación agregada exitosamente'], 201);
        } else {
            $this->jsonResponse(['error' => 'Error al agregar la publicación'], 500);
        }
    }

    public function actualizarPublicacion($data) {
        $num_doc = $this->validarToken();

        if (empty($data['idPublicacion'])) {
            $this->jsonResponse(['error' => 'ID de publicación no proporcionado'], 400);
        }

        if ($this->publicaciones->actualizarPublicacion($data)) {
            $this->jsonResponse(['mensaje' => 'Publicación actualizada exitosamente'], 200);
        } else {
            $this->jsonResponse(['error' => 'Error al actualizar la publicación'], 500);
        }
    }

    public function eliminarPublicacion($data) {
        $num_doc = $this->validarToken();

        // Validar si se proporciona el ID
        if (empty($data['idPublicacion'])) {
            $this->jsonResponse(['error' => 'ID de publicación no proporcionado'], 400);
        }

        // Llamamos al modelo para eliminar la publicación
        if ($this->publicaciones->eliminarPublicacion($data['idPublicacion'])) {
            $this->jsonResponse(['mensaje' => 'Publicación eliminada exitosamente'], 200);
        } else {
            $this->jsonResponse(['error' => 'Error al eliminar la publicación'], 500);
        }
    }
}
