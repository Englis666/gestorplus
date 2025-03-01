<?php
// Modelos y Configuración
require_once 'modelo/administrador.php';
require_once 'config/config.php';
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  


use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AdministradorControlador {
    private $db;
    private $administrador;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->administrador = new Administrador($this->db);
    }

    private function jsonResponse($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    private function verificarToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? null;
        if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
            $this->jsonResponse(['error' => 'Token no proporcionado o formato incorrecto'], 401);
        }
        try {
            return JWT::decode($matches[1], new Key(SECRET_KEY, JWT_ALGO));
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Error en el token: ' . $e->getMessage()], 401);
        }
    }

    public function obtenerCargos() {
        $this->jsonResponse(['cargos' => $this->administrador->obtenerCargos() ?: []]);
    }

    public function obtenerPazYSalvos() {
        $this->jsonResponse(['Salvos' => $this->administrador->obtenerPazYSalvos() ?: []]);
    }

    public function obtenerPostulaciones() {
        $this->jsonResponse(['Postulaciones' => $this->administrador->obtenerPostulaciones() ?: []]);
    }

    public function obtenerEmpleados() {
        $this->jsonResponse(['empleados' => $this->administrador->obtenerEmpleados() ?: []]);
    }

    public function obtenerTodasLasNotificaciones() {
        $this->jsonResponse(['Notificaciones' => $this->administrador->obtenerTodasLasNotificaciones() ?: []]);
    }

    public function obtenerTodasLasEstadisticas() {
        $estadisticas = $this->administrador->obtenerTotalEstadisticas();
        
        $this->jsonResponse([
            'totalEntradas' => $estadisticas['totalEntradas'],
            'totalAusencias' => $estadisticas['totalAusencias']
        ]);
    }
    

    public function obtenerTodasLasHorasExtra() {
        $decoded = $this->verificarToken();
        $num_doc = $decoded->data->num_doc;
        $this->jsonResponse($this->administrador->verificarRol($num_doc));
    }



    public function obtenerTodasLasJornadas() {
        $this->jsonResponse(['Jornadas' => $this->administrador->obtenerTodasLasJornadas() ?: []]);
    }

    public function obtenerTodasLasAusencias() {
        $this->jsonResponse(['Ausencias' => $this->administrador->obtenerTodasLasAusencias() ?: []]);
    }

    public function obtenerUsuarios() {
        $this->jsonResponse(['RRHH' => $this->administrador->obtenerUsuarios() ?: []]);
    }

    public function obtenerEntrevistas() {
        $this->jsonResponse(['Entrevista' => $this->administrador->obtenerEntrevistas() ?: []]);
    }

    public function obtenerDatosDelEntrevistado() {
        $this->jsonResponse(['Entrevistado' => $this->administrador->obtenerDatosDelEntrevistado() ?: []]);
    }

    public function corroborarJornada($data) {
        if (!isset($data['data']['idJornada'])) {
            $this->jsonResponse(['error' => 'Falta el id de la jornada'], 400);
        }
        $this->jsonResponse(['Jornada' => $this->administrador->corroborarJornada($data['data']['idJornada']) ?: []]);
    }

    public function notificacionAceptada($data) {
        if (!isset($data['data']['idausencia'])) {
            $this->jsonResponse(['error' => 'Falta el id de la ausencia'], 400);
        }
        $this->jsonResponse(['Ausencia' => $this->administrador->notificacionAceptada($data['data']['idausencia']) ?: []]);
    }

    public function agregarCargo($data) {
        if (!isset($data['nombreCargo'])) {
            $this->jsonResponse(['error' => 'Faltan datos'], 400);
        }
        $this->jsonResponse(['success' => true, 'cargo' => $this->administrador->agregarCargo($data['nombreCargo']) ?: []]);
    }

    public function agregarConvocatoria($data) {
        $required = ['nombreConvocatoria', 'descripcion', 'requisitos', 'salario', 'cantidadConvocatoria'];
        foreach ($required as $key) {
            if (!isset($data[$key])) {
                $this->jsonResponse(['error' => 'Faltan datos'], 400);
            }
        }
        $this->jsonResponse(['Convocatoria' => $this->administrador->agregarConvocatoria($data) ?: []]);
    }

    public function asignarEntrevista($data) {
        $required = ['fecha', 'hora', 'lugarMedio'];
        foreach ($required as $key) {
            if (!isset($data[$key])) {
                $this->jsonResponse(['error' => 'Faltan datos'], 400);
            }
        }
        $this->jsonResponse(['Entrevista' => $this->administrador->asignarEntrevista($data) ?: []]);
    }
}
