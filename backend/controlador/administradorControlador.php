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

    public function obtenerCargos(){
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerCargos();
        if($resultados){
            echo json_encode(['cargos' => $resultados]);
        } else{
            echo json_encode(['cargos' =>[]]);
        }
    }
    public function obtenerPazYSalvos(){
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerPazYSalvos();
        if($resultados){
            echo json_encode(['Salvos' => $resultados]);
        } else{
            echo json_encode(['Salvos' => []]);
        }
    }

    public function obtenerPostulaciones(){
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerPostulaciones();
        if($resultados){
            echo json_encode(['Postulaciones' => $resultados]);
        } else{
            echo json_encode(['Postulaciones' => []]);
        }
    }


    public function obtenerEmpleados(){
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerEmpleados();
        if($resultados){
            echo json_encode(['empleados' => $resultados]);
        } else{
            echo json_encode(['empleados' =>[]]);
        }
    }

    public function obtenerTodasLasNotificaciones(){

        try {
            $this->administrador = new Administrador($this->db);
            $resultados = $this->administrador->obtenerTodasLasNotificaciones();
    
            if ($resultados) {
                echo json_encode(['Notificaciones' => $resultados]);
            } else {
                echo json_encode(['Notificaciones' => []]);
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
    
    
    

    public function obtenerTodasLasHorasExtra(){
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? null;
        
        if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Token no proporcionado o formato incorrecto']);
            return;
        }
    
        $token = $matches[1]; 
        $response = [];
    
        try {
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;
    
            $this->administrador = new Administrador($this->db);
            $resultados = $this->administrador->verificarRol($num_doc);
            $response = $resultados;
        } catch (\Firebase\JWT\ExpiredException $e) {
            http_response_code(401);
            $response = ['error' => 'Token expirado'];
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            http_response_code(401);
            $response = ['error' => 'Token con firma inválida'];
        } catch (\Exception $e) {
            http_response_code(500);
            $response = ['error' => 'Error al procesar el token: ' . $e->getMessage()];
        }
    
        echo json_encode($response);
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
            $resultados = $this->administrador->obtenerPazYsalvos();

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

    public function obtenerDatosDelEntrevistado(){
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->obtenerDatosDelEntrevistado();
        if($resultados){
            echo json_encode(['Entrevistado' => $resultados]);
        }else{
            echo json_encode(['Entrevistado'=>[]]);
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

    public function agregarCargo($data){
        if (!isset($data['nombreCargo'])) {
            echo json_encode(['success' => false, 'error' => 'Faltan datos']);
            http_response_code(400);
            return;
        }
        $nombreCargo = $data['nombreCargo'];

        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->agregarCargo($nombreCargo);
        if ($resultados) {
            echo json_encode(['success' => true, 'cargo' => $resultados]);
        } else {
            echo json_encode(['success' => false, 'cargo' => []]);
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

    public function asignarEntrevista($data){
        if(!isset($data['fecha'], $data['hora'], $data['lugarMedio'])){
            echo json_encode(['error' => 'Faltan datos']);
            http_response_code(400);
            return;
        }
        $this->administrador = new Administrador($this->db);
        $resultados = $this->administrador->asignarEntrevista($data);

        if($resultados){
            echo json_encode(['Entrevista' => $resultados]);
        } else{
            echo json_encode(['Entrevista' => []]);
        }
    }
     
    public function asistenciaConfirmada($data){
        $this->administrador = new Administrador($this->db);

        if(!isset($data['data']['identrevista'])){
            echo json_encode(['error' => 'Falta el identificador de la entrevista']);
            http_response_code(400);
            return;
        }

        $identrevista = $data['data']['identrevista'];

        $resultados = $this->administrador->asistenciaConfirmada($identrevista);

        if($resultados){
            echo json_encode(['Asistencia' => $resultados]);
        } else {
            echo json_encode(['Asistencia'=> []]);
        }
    }

    public function asistenciaNoConfirmadar($data){
        $this->administrador = new Administrador($this->db);

        if(!isset($data['data']['identrevista'])){
            echo json_encode(['error' => 'Falta el identificador de la entrevista' ]);
            http_response_code(400);
            return;
        }
        $identrevista = $data['data']['identrevista'];
        $resultados = $this->administrador->asistenciaNocConfirmada($identrevista);

        if($resultados){
            echo json_encode(['noAsistencia' => $resultados]);
        } else {
            echo json_encode(['noAsistencia' => []]);
        }

    }
    

}


?>