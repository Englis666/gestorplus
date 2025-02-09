<?php
//MODELOS 
require_once 'modelo/administrador.php';
//DB
require_once 'config/config.php';

//JWT
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AdministradorControlador {

    private $db;
    private $administrador;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->administrador = new Administrador($this->db);
    }


    public function obtenerTodasLasNotificaciones(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try{
            $this->administrador = new Administrador($this->db);
            $resultados = $this->administrador->obtenerTodasLasNotificaciones();

            if($resultados){
                echo json_encode(['Notificaciones' => $resultados]);
            } else{
                echo json_encode(['Notificaciones' =>[]]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }
    }

    public function obtenerTodasLasHorasExtra(){
    $authHeader = apache_request_headers()['Authorization'] ?? null;
    
    if (!$authHeader){
        echo json_encode(['error' => 'Token no proporcionado']);
        http_response_code(401);
        return;
    }
    
    $token = str_replace('Bearer ', '', $authHeader);
    
    try {   
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerTodasLasHorasExtra();
        
        if ($resultados) {
            echo json_encode(['HorasExtra' => $resultados]);
        } else {
            echo json_encode(['HorasExtra' => []]);
        }
    } catch (\Firebase\JWT\ExpiredException $e) {
        echo json_encode(['error' => 'Token expirado']);
        http_response_code(401);
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        echo json_encode(['error' => 'Token con firma inválida']);
        http_response_code(401);
    } catch (\Exception $e) {
        echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        http_response_code(500);
    }
}



    public function obtenerConvocatorias(){
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerConvocatorias();
        if($resultados){
            echo json_encode(['Convocatorias' => $resultados]);
        } else{
            echo json_encode(['Convocatorias' =>[]]);
        }
    }


    public function obtenerTodasLasJornadas(){

        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try{
            $this->administrador = new Administrador($this->db);
            $resultados = $this->administrador->obtenerTodasLasJornadas();

            if($resultados){
                echo json_encode(['Jornadas' => $resultados]);
            } else{
                echo json_encode(['Jornadas' =>[]]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }   
    }

    public function obtenerTodasLasAusencias(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }
        $token = str_replace('Bearer ', '', $authHeader);

        try{
            $this->administrador = new Administrador($this->db);
            $resultados = $this->administrador->obtenerTodasLasAusencias();

            if($resultados){
                echo json_encode(['Ausencias' => $resultados]);
            } else{
                echo json_encode(['Ausencias' =>[]]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }
    }
    public function obtenerTodasLasPazYsalvos(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }
        $token = str_replace('Bearer ', '', $authHeader);

        try{
            $this->administrador = new Administrador($this->db);
            $resultados = $this->administrador->obtenerTodasLasPazYsalvos();

            if($resultados){
                echo json_encode(['PazYsalvos' => $resultados]);
            } else{
                echo json_encode(['PazYsalvos' =>[]]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }
    }
    public function obtenerTodasLasVacaciones(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader) {
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }   
        $token = str_replace('Bearer ', '', $authHeader);
        try{
            $this->administrador = new Administrador($this->db);

            $resultados = $this->administrador->obtenerTodasLasVacaciones();
                if($resultados){
                    echo json_encode(['Vacaciones' => $resultados]);
                } else {
                    echo json_encode(['Vacaciones' => []]);
                }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }


    }

    public function obtenerUsuarios(){
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerUsuarios();
        if($resultados){
            echo json_encode(['RRHH' => $resultados]);
        } else{
            echo json_encode(['RRHH' =>[]]);
        }
    }

    public function obtenerEntrevistas(){
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerEntrevistas();
        if($resultados){
            echo json_encode(['Entrevista' => $resultados]);
        } else{
            echo json_encode(['Entrevista' => $resultados]);
        }
    }


    public function corroborarJornada($data){
        $this->administrador = new Administrador($this->db);
        
        if(!isset($data['data']['idJornada'])){
            echo json_encode(['error' => 'Falta el id de la jornada']);
            http_response_code(400);
            return;
        }
        
        $idJornada = $data['data']['idJornada']; 
        $resultados = $this->administrador->corroborarJornada($idJornada);
        
        if($resultados){
            echo json_encode(['Jornada' => $resultados]);
        } else {
            echo json_encode(['Jornada' => []]);
        }
    }
    

    public function noCorroborarJornada($data){
        $this->administrador = new Administrador($this->db);
        if(!isset($data['data']['idJornada'])){
            echo json_encode(['error' => 'Falta el id de la jornada']);
            http_response_code(400);
            return;
        }
        $idJornada = $data['data']['idJornada']; 
        $resultados = $this->administrador->noCorroborarJornada($idJornada);
        if($resultados){
            echo json_encode(['Jornada' => $resultados]);
        } else{
            echo json_encode(['Jornada' =>[]]);
        }
    }

    public function notificacionAceptada($data){
        $this->administrador = new Administrador($this->db);
        if(!isset($data['data']['idausencia'])){
            echo json_encode(['error' => 'Falta el id de la ausencia']);
            http_response_code(400);
            return;
        }
        $idausencia = $data['data']['idausencia'];
        $resultados = $this->administrador->notificacionAceptada($idausencia);
        if($resultados){
            echo json_encode(['Ausencia' => $resultados]);
        } else{
            echo json_encode(['Ausencia' =>[]]);
        }

    }

    public function notificacionRechazada($data){
        $this->administrador = new Administrador($this->db);
        if(!isset($data['data']['idausencia'])){
            echo json_encode(['error' => 'Falta el id de la ausencia']);
            http_response_code(400);
            return;
        }
        $idausencia = $data['data']['idausencia'];
        $resultados = $this->administrador->notificacionRechazada($idausencia);
        if($resultados){
            echo json_encode(['Ausencia' => $resultados]);
        } else{
            echo json_encode(['Ausencia' =>[]]);
        }
    }

    public function agregarConvocatoria($data){    
        if(!isset($data['nombreConvocatoria'], $data['descripcion'], $data['requisitos'], $data['salario'], $data['cantidadConvocatoria'])){
            echo json_encode(['error' => 'Faltan datos']);
            http_response_code(400);
            return;
        }
    
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->agregarConvocatoria($data);
        
        if ($resultados) {
            echo json_encode(['Convocatoria' => $resultados]);
        } else {
            echo json_encode(['Convocatoria' => []]);
        }
    }
    
   
    



}


?>