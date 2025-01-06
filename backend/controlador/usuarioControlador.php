<?php
// MODELOS 
require_once 'modelo/usuario.php';
require_once 'config/config.php';

// COMPOSER PARA TOKEN
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;


class UsuarioControlador {

    private $db;
    private $usuario;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
    }

    public function registrar($data){
        $this->usuario = new Usuario($this->db);
        $data = [
            'num_doc' => $data['num_doc'], 
            'nombres' => $data['nombres'],
            'apellidos' => $data['apellidos'],
            'email' => $data['email'],
            'tipodDoc' => $data['tipodDoc'],
            'password' => password_hash($data['password'], PASSWORD_BCRYPT),  
            'estado' => 1,  
            'rol_idrol' => 4  
        ];
        $respuesta = $this->usuario->registrar($data);
        echo json_encode(['message' => $respuesta]);
    }


    public function iniciar($data) {
        $this->usuario = new Usuario($this->db);
    
        $num_doc = isset($data['num_doc']) ? trim($data['num_doc']) : null;
        $password = isset($data['password']) ? trim($data['password']) : null;
    
        if (!$num_doc || !$password) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Número de documento y contraseña son requeridos'
            ]);
            return;
        }
    
        $respuesta = $this->usuario->inicioSesion(['num_doc' => $num_doc, 'password' => $password]);               

        if ($respuesta) {
            try {
                $secretKey = SECRET_KEY;
                $firma = JWT_ALGO;
                $issuedAt = time();
                $expirantionTime = $issuedAt + 3600;

                $payload = [
                    'iss' => '/',     
                    'aud' => 'localhost',      
                    'iat' => $issuedAt,           
                    'exp' => $expirantionTime,    
                    'data' => [
                        'num_doc' => $respuesta['num_doc'],
                        'nombres' => $respuesta['nombres'],
                        'rol' => (string) $respuesta['rol'],  
                        'hojadevida_idHojadevida' => $respuesta['hojadevida_idHojadevida']
                    ]
                ];

                $jwt = JWT::encode($payload, $secretKey, $firma);
    

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Credenciales correctas',
                    'token' => $jwt
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Error al generar el token: ' . $e->getMessage()
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Credenciales incorrectas'
            ]);
        }
    }
    
    public function datosPerfil(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if(!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }
        $token = str_replace('Bearer ', '', $authHeader);
        try{
            $secretKey = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;

            if(!$num_doc){
                echo json_encode(['error' => 'No se encontro el numero de documento']);
                http_response_code(400);
                return;
            }
            $this->usuario = new Usuario($this->db);
            $resultado = $this->usuario->datosPerfil($num_doc);
            if($resultado){
                return $resultado[];
            }
        }
    }

    public function actualizarPerfil(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if(!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }
        $token = str_replace('Bearer ', '', $authHeader);

        try{
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;
            if(!$num_doc){
                echo json_encode(['error' => 'No se encontro el numero de documento']);
                http_response_code(400);
                return;
            }
            $this->usuario = new Usuario($this->db);
            $resultado = $this->usuario->actualizarPerfil($num_doc);
            if($resultado){
                return $resultado[];
            }
        }

    }

    public function actualizacionHojaDevida(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if(!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }
        $token = str_replace('Bearer ', '', $authHeader);

        try{
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;
            if(!$num_doc){
                echo json_encode(['error' => 'No se encontro el numero de documento']);
                http_response_code(400);
                return;
            }
            $this->usuario = new Usuario($this->db);
            $resultado = $this->usuario->actualizacionHojadevida($num_doc);
            if($resultado){
                return $resultado[];
            }
        }
    }

    public function subirEstudios(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if(!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }        
        $token = str_replace('Bearer ', '', $authHeader);
        try{
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;
            if(!$num_doc){
                echo json_encode(['error' => 'No se encontro el numero de documento']);
                http_response_code(400);
                return;
            }
            $this->usuario = new Usuario($this->db);
            $resultado = $this->usuario->subirEstudios($num_doc);
            if($resultado){
                return $resultado[];
            }
        }
    }
    public function subirExp(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if(!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }
        $token = str_replace('Bearer ', '', $authHeader);
        try{
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;
            if(!$num_doc){
                echo json_encode(['error' => 'No se encontro el numero de documento']);
                http_response_code(400);
                return;
            }
            $this->usuario = new Usuario($this->db);
            $resultado = $this->usuario->subirExp($num_doc);
            if($resultado){
                return $resultado[];
            }
        }
    }

    
    public function obtenerConvocatorias(){
        $this->usuario  = new Usuario($this->db);
        $resultado = $this->usuario->obtenerConvocatorias();
        if($resultado){
            echo json_encode(['convocatorias' => $resultado]); 
        }else {
            echo json_encode(['convocatorias' => []]);
        }
    }

    public function obtenerTotalEstadisticas() {
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader) {
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }
    
        $token = str_replace('Bearer ', '', $authHeader);
    
        try {
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;

            if (!$num_doc) {
                echo json_encode(['error' => 'No se encontró el número de documento en el token']);
                http_response_code(400);
                return;
            }    
    
            $this->usuario = new Usuario($this->db);
            $resultados = $this->usuario->obtenerTotalEstadisticas($num_doc);
    
            if ($resultados) {
                echo json_encode([
                    'totalEntradas' => $resultados['totalEntradas'],
                    'totalAusencias' => $resultados['totalAusencias']
                ]);
            } else {
                echo json_encode([
                    'totalEntradas' => 0,
                    'totalAusencias' => 0,
                ]);
            }
    
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
            http_response_code(401);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
            http_response_code(401);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
            http_response_code(500);
        }
    }
    
    public function obtenerRRHH(){
        $this->usuario = new Usuario($this->db);
        $resultado = $this->usuario->obtenerRRHH();
        if($resultado){
            echo json_encode(['RRHH' => $resultado]);
        }else{
            echo json_encode(['RRH' => []]);
        }
    }


}
?>