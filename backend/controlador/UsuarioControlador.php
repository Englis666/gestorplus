<?php
namespace Controlador;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Modelo\Usuario;
use Config\Database;
use Config\Clave;

class UsuarioControlador {

    private $db;
    private $usuario;

    public function __construct() {
        $this->db = (new DataBase())->getConnection();
        $this->usuario = new Usuario($this->db);
    }

    private function jsonResponse($status, $message, $data = []) {
        echo json_encode(array_merge(['status' => $status, 'message' => $message], $data));
    }

    private function verificarToken() {
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader) {
            http_response_code(401);
            $this->jsonResponse('error', 'Token no proporcionado');
            exit;
        }
        
        try {
            return JWT::decode(str_replace('Bearer ', '', $authHeader), new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
        } catch (Exception $e) {
            http_response_code(401);
            $this->jsonResponse('error', 'Token inválido: ' . $e->getMessage());
            exit;
        }
    }

    public function registrar($data) {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['estado'] = 1;
        $data['rol_idrol'] = 4;
        
        $this->jsonResponse('success', $this->usuario->registrar($data));
    }

    public function iniciar($data) {
        if (empty($data['num_doc']) || empty($data['password'])) {
            $this->jsonResponse('error', 'Número de documento y contraseña son requeridos');
            return;
        }
        
        $usuario = $this->usuario->inicioSesion(['num_doc' => trim($data['num_doc']), 'password' => trim($data['password'])]);
        if (!$usuario) {
            $this->jsonResponse('error', 'Credenciales incorrectas');
            return;
        }

        $payload = [
            'iss' => '/', 
            'aud' => 'localhost,192.168.80.28',
            'iat' => time(), 
            'exp' => time() + 3600,
            'data' => [
                'num_doc' => $usuario['num_doc'],
                'nombres' => $usuario['nombres'],
                'rol' => (string) $usuario['rol'],
                'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
            ]
        ];
        
        $this->jsonResponse('success', 'Credenciales correctas', ['token' => JWT::encode($payload, Clave::SECRET_KEY, Clave::JWT_ALGO)]); 
    }
    public function obtenerNotificaciones(): void {
        $decoded = $this->verificarToken();
        $this->jsonResponse('Notificaciones', $this->usuario->obtenerNotificaciones($decoded->data->num_doc));
    }


    public function datosPerfil() {
        $decoded = $this->verificarToken();
        $resultado = $this->usuario->datosPerfil($decoded->data->num_doc);
        
        $resultado ? $this->jsonResponse('success', '', $resultado) 
                   : $this->jsonResponse('error', 'No se encontraron datos', [], 404);
    }

    public function actualizarPerfil($data) {
        $decoded = $this->verificarToken();
        
        if (empty($data['nombres']) || empty($data['apellidos']) || empty($data['email']) || empty($data['tipoDoc'])) {
            $this->jsonResponse('error', 'Faltan datos requeridos para actualizar el perfil', [], 400);
            return;
        }

        $resultado = $this->usuario->actualizarPerfil($data, $decoded->data->num_doc);
        $this->jsonResponse($resultado ? 'success' : 'error', $resultado ? 'Perfil actualizado correctamente' : 'No se pudo actualizar el perfil');
    }

    public function actualizacionHojaDevida($data) {
        $decoded = $this->verificarToken();
        
        foreach (['fechaNacimiento', 'direccion', 'ciudad', 'ciudadNacimiento', 'telefono', 'telefonoFijo'] as $campo) {
            if (!isset($data[$campo])) {
                $this->jsonResponse('error', "El campo $campo es obligatorio", [], 400);
                return;
            }
        }
        
        $resultado = $this->usuario->actualizacionHojadevida($data, $decoded->data->hojadevida_idHojadevida);
        $this->jsonResponse($resultado ? 'success' : 'error', $resultado ? 'Hoja de vida actualizada' : 'No se pudo actualizar la hoja de vida');
    }

    public function agregarEstudio($data) {
        $decoded = $this->verificarToken();
        $resultado = $this->usuario->agregarEstudio($data, $decoded->data->hojadevida_idHojadevida);
        $this->jsonResponse($resultado ? 'success' : 'error', $resultado ? 'Estudio agregado' : 'No se pudo agregar el estudio');
    }

    public function agregarExp($data) {
        $decoded = $this->verificarToken();
        $resultado = $this->usuario->agregarExp($data, $decoded->data->hojadevida_idHojadevida);
        $this->jsonResponse($resultado ? 'success' : 'error', $resultado ? 'Experiencia agregada' : 'No se pudo agregar la experiencia');
    }

    public function obtenerConvocatorias() {
        $resultado = $this->usuario->obtenerConvocatorias();
        $this->jsonResponse('success', '', ['convocatorias' => $resultado ?: []]);
    }

    public function obtenerTotalEstadisticas() {
        $decoded = $this->verificarToken();
        $resultados = $this->usuario->obtenerTotalEstadisticas($decoded->data->num_doc);
        
        $this->jsonResponse('success', '', [
            'totalEntradas' => $resultados['totalEntradas'] ?? 0,
            'totalAusencias' => $resultados['totalAusencias'] ?? 0
        ]);
    }

    public function obtenerRRHH() {
        $resultado = $this->usuario->obtenerRRHH();
        $this->jsonResponse('success', '', ['RRHH' => $resultado ?: []]);
    }

    public function obtenerDatosParaCertificado(){
        $decoded = $this->verificarToken();
        $resultado = $this->usuario->obtenerDatosParaCertificado($decoded->data->num_doc);
        $this->jsonResponse('success', '' , ['Certificado' => $resultado ?: []]); 
        
    }

}

?>
