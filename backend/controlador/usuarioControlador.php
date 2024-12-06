<?php
// MODELOS 
require_once 'modelo/usuario.php';
require_once 'config/config.php';

// COMPOSER PARA TOKEN
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  
use \Firebase\JWT\JWT;

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
                // Guardar la información del usuario en la sesión
                $_SESSION['usuario'] = [
                    'num_doc' => $respuesta['num_doc'],
                    'nombres' => $respuesta['nombres'],
                    'rol' => $respuesta['rol'],
                    'hojadevida_idHojadevida' => $respuesta['hojadevida_idHojadevida']
                ];

                // Generar el JWT para el cliente
                $secretKey = SECRET_KEY;
                $payload = [
                    'iss' => 'localhost',     
                    'aud' => 'localhost',      
                    'iat' => time(),           
                    'exp' => time() + 3600,    
                    'data' => [
                        'num_doc' => $respuesta['num_doc'],
                        'nombres' => $respuesta['nombres'],
                        'rol' => $respuesta['rol'],  
                        'hojadevida_idHojadevida' => $respuesta['hojadevida_idHojadevida']
                    ]
                ];
                $jwt = JWT::encode($payload, $secretKey, 'HS256');                

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Credenciales correctas',
                    'token' => $jwt, 
                    'session' => $_SESSION['usuario']  
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
        $this->usuario = new Usuario($this->db);
        
        $resultados = $this->usuario->obtenerTotalEstadisticas();
    
        if ($resultados) {
            echo json_encode([
                'totalEntradas' => $resultados['totalEntradas'],
                'totalAusencias' => $resultados['totalAusencias']
            ]);
        } else {
            echo json_encode([
                'totalEntradas' => 0,
                'totalAusencias' => 0
            ]);
        }
    }
}
?>