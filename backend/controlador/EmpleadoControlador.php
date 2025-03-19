<?php
namespace Controlador;

use Modelo\Empleado;
use Config\DataBase;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class EmpleadoControlador {
    private $db;
    private Empleado $empleado;

    public function __construct() {
        $this->db = (new DataBase())->getConnection();
        $this->empleado = new Empleado($this->db);
    }

    private function jsonResponse(array $data, int $statusCode = 200): void {
        http_response_code($statusCode);
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
            return JWT::decode($token, new Key(SECRET_KEY, JWT_ALGO))->data->num_doc;
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

    public function obtenerNotificaciones(): void {
        $num_doc = $this->validarToken();
        $this->responder('Notificaciones', $this->empleado->obtenerNotificaciones($num_doc));
    }

    public function obtenerMisVacaciones(): void {
        $num_doc = $this->validarToken();
        $this->responder('Vacaciones', $this->empleado->obtenerMisVacaciones($num_doc));
    }

    public function obtenerJornadas(): void {
        $num_doc = $this->validarToken();
        $this->responder('Jornadas', $this->empleado->obtenerJornadas($num_doc));
    }

    public function obtenerAusencias(): void {
        $num_doc = $this->validarToken();
        $this->responder('Ausencias', $this->empleado->obtenerAusencias($num_doc));
    }

    public function obtenerPazYsalvos(): void {
        $num_doc = $this->validarToken();
        $this->responder('PazYSalvo', $this->empleado->obtenerPazYsalvos($num_doc));
    }

    public function solicitarQueja(array $data): void {
        $num_doc = $this->validarToken();
        $this->jsonResponse([
            'message' => $this->empleado->solicitarQueja($num_doc, $data) ? 'Queja enviada' : 'Error al enviar la queja'
        ]);
    }

    public function solicitarAusencia(array $data): void {
        $num_doc = $this->validarToken();
        $this->jsonResponse([
            'message' => $this->empleado->solicitarAusencia($num_doc, $data) ? 'Ausencia solicitada' : 'Error al solicitar la ausencia'
        ]);
    }

    public function solicitarVacaciones(array $data): void {
        $num_doc = $this->validarToken();
        $this->jsonResponse([
            'message' => $this->empleado->solicitarVacaciones($num_doc, $data) ? 'Vacaciones solicitadas' : 'Error al solicitar las vacaciones'
        ]);
    }
}
