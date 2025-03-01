<?php
// Modelos 
require_once 'modelo/empleado.php';
require_once 'config/config.php';
// JWT
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class EmpleadoControlador {
    private $db;
    private $empleado;

    public function __construct() {
        $this->db = (new DataBase())->getConnection();
        $this->empleado = new Empleado($this->db);
    }

    private function obtenerToken() {
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(['error' => 'Token no proporcionado']);
            exit;
        }
        return str_replace('Bearer ', '', $authHeader);
    }

    private function validarToken($token) {
        try {
            return JWT::decode($token, new Key(SECRET_KEY, JWT_ALGO))->data->num_doc;
        } catch (Firebase\JWT\ExpiredException $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Token expirado']);
            exit;
        } catch (Firebase\JWT\SignatureInvalidException $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Token con firma inválida']);
            exit;
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
            exit;
        }
    }

    private function responder($clave, $resultado) {
        echo json_encode([$clave => $resultado ?: []]);
    }

    public function obtenerNotificaciones() {
        $num_doc = $this->validarToken($this->obtenerToken());
        $this->responder('Notificaciones', $this->empleado->obtenerNotificaciones($num_doc));
    }

    public function obtenerMisVacaciones() {
        $num_doc = $this->validarToken($this->obtenerToken());
        $this->responder('Vacaciones', $this->empleado->obtenerMisVacaciones($num_doc));
    }

    public function obtenerJornadas() {
        $num_doc = $this->validarToken($this->obtenerToken());
        $this->responder('Jornadas', $this->empleado->obtenerJornadas($num_doc));
    }

    public function obtenerAusencias() {
        $num_doc = $this->validarToken($this->obtenerToken());
        $this->responder('Ausencias', $this->empleado->obtenerAusencias($num_doc));
    }

    public function obtenerPazYsalvos() {
        $num_doc = $this->validarToken($this->obtenerToken());
        $this->responder('PazYSalvo', $this->empleado->obtenerPazYsalvos($num_doc));
    }

    public function solicitarQueja($data) {
        $num_doc = $this->validarToken($this->obtenerToken());
        echo json_encode(['message' => $this->empleado->solicitarQueja($num_doc, $data) ? 'Queja enviada' : 'Error al enviar la queja']);
    }

    public function solicitarAusencia($data) {
        $num_doc = $this->validarToken($this->obtenerToken());
        echo json_encode(['message' => $this->empleado->solicitarAusencia($num_doc, $data) ? 'Ausencia solicitada' : 'Error al solicitar la ausencia']);
    }

    public function obtenerMiPazYSalvo() {
        $num_doc = $this->validarToken($this->obtenerToken());
        $this->responder('PazYSalvo', $this->empleado->obtenerMiPazYSalvo($num_doc));
    }

    public function solicitarVacaciones($data) {
        $num_doc = $this->validarToken($this->obtenerToken());
        echo json_encode(['message' => $this->empleado->solicitarVacaciones($num_doc, $data) ? 'Vacaciones solicitadas' : 'Error al solicitar las vacaciones']);
    }
}