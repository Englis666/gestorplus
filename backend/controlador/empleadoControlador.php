<?php
// MODELOS
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

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
    }

    private function validarToken() {
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(['error' => 'Token no proporcionado']);
            exit;
        }
        
        $token = str_replace('Bearer ', '', $authHeader);
        try {
            return JWT::decode($token, new Key(SECRET_KEY, JWT_ALGO));
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

    private function procesarSolicitud($metodo) {
        $decoded = $this->validarToken();
        $num_doc = $decoded->data->num_doc ?? null;
        if (!$num_doc) {
            http_response_code(400);
            echo json_encode(['error' => 'No se encontró el número de documento en el token']);
            exit;
        }

        $this->empleado = new Empleado($this->db);
        $resultado = $this->empleado->{$metodo}($num_doc);
        echo json_encode([$metodo => $resultado ?: []]);
    }

    public function obtenerNotificaciones() { $this->procesarSolicitud('obtenerNotificaciones'); }
    public function obtenerMisVacaciones() { $this->procesarSolicitud('obtenerMisVacaciones'); }
    public function obtenerJornadas() { $this->procesarSolicitud('obtenerJornadas'); }
    public function obtenerAusencias() { $this->procesarSolicitud('obtenerAusencias'); }
    public function obtenerPazYsalvos() { $this->procesarSolicitud('obtenerPazYsalvos'); }
    public function obtenerMiPazYSalvo() { $this->procesarSolicitud('obtenerMiPazYSalvo'); }

    private function procesarSolicitudConDatos($metodo, $data) {
        $decoded = $this->validarToken();
        $num_doc = $decoded->data->num_doc ?? null;
        if (!$num_doc) {
            http_response_code(400);
            echo json_encode(['error' => 'No se encontró el número de documento']);
            exit;
        }
        
        $this->empleado = new Empleado($this->db);
        $resultado = $this->empleado->{$metodo}($num_doc, $data);
        echo json_encode(['message' => $resultado ? ucfirst($metodo) . ' procesado' : 'Error al procesar ' . $metodo]);
    }

    public function solicitarQueja($data) { $this->procesarSolicitudConDatos('solicitarQueja', $data); }
    public function solicitarAusencia($data) { $this->procesarSolicitudConDatos('solicitarAusencia', $data); }
    public function solicitarVacaciones($data) { $this->procesarSolicitudConDatos('solicitarVacaciones', $data); }
}
?>
