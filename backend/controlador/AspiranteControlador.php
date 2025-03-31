<?php
namespace Controlador;

use Config\DataBase;
use Config\Clave;
use Modelo\Aspirante;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AspiranteControlador {
    private $db;
    private $aspirante;

    public function __construct() {
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->aspirante = new Aspirante($this->db);
    }

    private function obtenerNumDocDesdeToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
            throw new Exception('Token no proporcionado o formato incorrecto', 401);
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
            return $decoded->data->num_doc ?? null;
        } catch (\Firebase\JWT\ExpiredException $e) {
            throw new Exception('Token expirado', 401);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            throw new Exception('Token con firma inválida', 403);
        } catch (Exception $e) {
            throw new Exception('Error al procesar el token: ' . $e->getMessage(), 400);
        }
    }

    private function jsonResponse($clave, $datos, $codigo = 200) {
        http_response_code($codigo);
        echo json_encode([$clave => $datos ?? []]);
    }

    public function obtenerNotificacionesAspirante() {
        try {
            $num_doc = $this->obtenerNumDocDesdeToken();
            $this->jsonResponse('Notificaciones', $this->aspirante->obtenerNotificacionesAspirante($num_doc));
        } catch (Exception $e) {
            $this->jsonResponse('error', $e->getMessage(), $e->getCode());
        }
    }

    public function verificarPostulacion() {
        try {
            $num_doc = $this->obtenerNumDocDesdeToken();
            $idconvocatoria = $_GET['idconvocatoria'] ?? null;

            if (!$idconvocatoria) {
                throw new Exception('Datos insuficientes', 400);
            }

            $resultados = $this->aspirante->verificarPostulacion($num_doc, $idconvocatoria);
            $this->jsonResponse('PostulacionVerificada', $resultados);
        } catch (Exception $e) {
            $this->jsonResponse('error', $e->getMessage(), $e->getCode());
        }
    }

    public function obtenerPostulacionesAspirante() {
        try {
            $num_doc = $this->obtenerNumDocDesdeToken();
            $this->jsonResponse('MisPostulaciones', $this->aspirante->obtenerPostulacionesAspirante($num_doc));
        } catch (Exception $e) {
            $this->jsonResponse('error', $e->getMessage(), $e->getCode());
        }
    }

    public function obtenerNotificaciones() {
        try {
            $num_doc = $this->obtenerNumDocDesdeToken();
            $this->jsonResponse('notificaciones', $this->aspirante->obtenerNotificaciones($num_doc));
        } catch (Exception $e) {
            $this->jsonResponse('error', $e->getMessage(), $e->getCode());
        }
    }

    public function obtenerDetalleConvocatoria() {
        try {
            $idconvocatoria = $_GET['idconvocatoria'] ?? null;

            if (!$idconvocatoria) {
                throw new Exception("No se encontró la convocatoria", 400);
            }

            $this->jsonResponse('DetalleConvocatoria', $this->aspirante->obtenerDetalleConvocatoria($idconvocatoria));
        } catch (Exception $e) {
            $this->jsonResponse('error', $e->getMessage(), $e->getCode());
        }
    }

    public function aplicacionDeAspirante($data) {
        try {
            $num_doc = $this->obtenerNumDocDesdeToken();
            $idconvocatoria = $data['idconvocatoria'] ?? null;

            if (!$idconvocatoria) {
                throw new Exception('Datos insuficientes', 400);
            }

            $resultado = $this->aspirante->aplicacionDeAspirante($num_doc, $idconvocatoria);
            if (!$resultado) {
                throw new Exception('No se pudo completar la aplicación', 500);
            }

            $this->jsonResponse('success', true);
        } catch (Exception $e) {
            $this->jsonResponse('error', $e->getMessage(), $e->getCode());
        }
    }
}
?>
