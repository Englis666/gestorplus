<?php
//MODELOS 
require_once 'modelo/empleado.php';
require_once 'config/config.php';
//JWT
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;


class EmpleadoControlador {

    private $db;
    private $empleado;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
    }


    public function obtenerNotificaciones(){
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
            
            $this->empleado = new Empleado($this->db);
            $resultado = $this->empleado->obtenerNotificaciones($num_doc); 
    
            if($resultado){
                echo json_encode(['Notificaciones' => $resultado]);
            } else {
                echo json_encode(['Notificaciones' => []]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        } 
    }

    public function obtenerMisVacaciones(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader) {
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
                echo json_encode(['error' => 'No se encontro el numero de documento en el token']);
                http_response_code(400);
                return;
            }
            $this->empleado = new Empleado($this->db);
            $resultado = $this->empleado->obtenerMisVacaciones($num_doc);
                if($resultado){
                    echo json_encode(['Vacaciones' => $resultado]);
                } else {
                    echo json_encode(['Vacaciones' => []]);
                }
        }catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }

    }


    public function obtenerJornadas(){
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
    
            $this->empleado = new Empleado($this->db);
            $resultado = $this->empleado->obtenerJornadas($num_doc);  
    
            if($resultado){
                echo json_encode(['Jornadas' => $resultado]);
            } else {
                echo json_encode(['Jornadas' => []]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }
        
    }

    public function obtenerAusencias(){
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
            $this->empleado = new Empleado($this->db);
            $resultado = $this->empleado->obtenerAusencias($num_doc);
            if($resultado){
                echo json_encode(['Ausencias' => $resultado]);
            }else{
                echo json_encode(['Ausencias' =>[]]);
            }
        }catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }
    }


    public function obtenerPazYsalvos(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if($authHeader){
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

            $this->empleado = new Empleado($this->db);
            $resultado = $this->empleado->obtenerPazYsalvos($num_doc);
            if($resultado){
                echo json_encode(['Ausencias' => $resultado]);
            }else{
                echo json_encode(['Ausencias' => []]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }   
    }
    

    public function solicitarQueja($data){
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
            $this->empleado = new Empleado($this->db);
            $resultado = $this->empleado->solicitarQueja($num_doc, $data);
            if($resultado){
                echo json_encode(['message' => 'Queja enviada']);
            }else{
                echo json_encode(['message' => 'Error al enviar la queja']);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }
    }

    public function solicitarAusencia($data){
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
            $this->empleado = new Empleado($this->db);
            $resultado = $this->empleado->solicitarAusencia($num_doc, $data);
            if($resultado){
                echo json_encode(['message' => 'Ausencia solicitada']);
            }else{
                echo json_encode(['message' => 'Error al solicitar la ausencia']);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }
    }


    public function solicitarVacaciones($data){
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
        $this->empleado = new Empleado($this->db);
        $resultado = $this->empleado->solicitarVacaciones($num_doc, $data);
        if ($resultado) {
            echo json_encode(['message' => 'Vacaciones solicitadas']);
        } else {
            echo json_encode(['message' => 'Error al solicitar las vacaciones']);
        }
    } catch (\Firebase\JWT\ExpiredException $e){
        echo json_encode(['error' => 'Token expirado']);
    } catch (\Firebase\JWT\SignatureInvalidException $e){
        echo json_encode(['error' => 'Token con firma invalida']);
    } catch (Exception $e){
        echo json_encode(['error' => 'Error al procesar el token' . $e->getMessage()]);
    }
}

}
?>