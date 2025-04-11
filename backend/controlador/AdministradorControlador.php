<?php
namespace Controlador;

use Modelo\Administrador;
use Config\Database;
use Config\Clave;
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
    
    // Intenta obtener el Authorization desde varias fuentes
    //SOLUCION DE TOKEN EN APP MOVIL
    
    $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

    if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
        $this->jsonResponse(['error' => 'Token no proporcionado o formato incorrecto'], 401);
    }

    $jwt = $matches[1];

    try {
        $decoded = JWT::decode($jwt, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
        return $decoded; 
    } catch (\Firebase\JWT\ExpiredException $e) {
        $this->jsonResponse(['error' => 'El token ha expirado'], 401);
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        $this->jsonResponse(['error' => 'Firma del token no válida'], 401);
    } catch (\Exception $e) {
        $this->jsonResponse(['error' => 'Error en el token: ' . $e->getMessage()], 401);
    }
}


    public function obtenerCargos() {
        $this->jsonResponse(['cargos' => $this->administrador->obtenerCargos() ?: []]);
    }
    public function obtenerVinculaciones(){
        $this->jsonResponse(['Vinculaciones' => $this->administrador->obtenerVinculaciones() ? : []]);
    }

     public function buscarIdEvaluacion() {
        $identrevista = $_GET['identrevista'] ?? null;
        if (!$identrevista) {
            echo json_encode(["error" => "Identificador de entrevista no encontrado"]);
            return;
        }

        $evaluacion = $this->administrador->buscarIdEvaluacion($identrevista);
        if ($evaluacion) {
            echo json_encode(["encontrada" => true, "idevaluacion" => $evaluacion['idevaluacion']]);
        } else {
            echo json_encode(["encontrada" => false]);
        }
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

    public function obtenerSistemaDeGestion(){
        $this->jsonResponse(['sistemaDeGestion' => $this->administrador->obtenerSistemaDeGestion() ?: []]);
    }

    public function obtenerTodasLasNotificaciones() {
        $this->verificarToken();
        $this->jsonResponse(['Notificaciones' => $this->administrador->obtenerTodasLasNotificaciones() ?: []]);
    }

    public function obtenerTodasLasEstadisticas() {
        $this->verificarToken();
        $estadisticas = $this->administrador->obtenerTotalEstadisticas();
        
        $this->jsonResponse([
            'totalEntradas' => $estadisticas['totalEntradas'],
            'totalAusencias' => $estadisticas['totalAusencias']
        ]);
    }
    public function obtenerTodasLasVacaciones(){
        $this->jsonResponse($this->administrador->obtenerTodasLasVacaciones());
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

    public function obtenerCargosParaConvocatorias(){
        $this->jsonResponse(['Cargos' => $this->administrador->obtenerCargosParaConvocatorias() ?: []]);
    }

    public function obtenerEntrevistas() {
        $this->jsonResponse(['Entrevista' => $this->administrador->obtenerEntrevistas() ?: []]);
    }

    public function obtenerDatosDelEntrevistado($num_doc) {
    $num_doc = $_GET['num_doc'] ?? null;
    $entrevistado = $this->administrador->obtenerDatosDelEntrevistado($num_doc);
    $this->jsonResponse(["Entrevistado" => $entrevistado ?: ["error" => "hubo un error"]]);
    }

    public function obtenerConvocatorias(){
        $this->jsonResponse(['convocatorias' => $this->administrador->obtenerConvocatorias() ? : []]);
    }
    public function obtenerConvocatoriasPostulaciones() {
        $this->jsonResponse(['ConvocatoriaPostulaciones' => $this->administrador->obtenerConvocatoriasPostulaciones() ?: []]);
    }

    public function corroborarJornada($data) {
        if (!isset($data['data']['idJornada'])) {
            $this->jsonResponse(['error' => 'Falta el id de la jornada'], 400);
        }
        $this->jsonResponse(['JornadaCorroborada' => $this->administrador->corroborarJornada($data['data']['idJornada']) ?: []]);
    }
    
    public function noCorroborarJornada($data) {
        if (!isset($data['data']['idJornada'])) {
            $this->jsonResponse(['error' => 'Falta el id de la jornada'], 400);
        }
        $this->jsonResponse(['JornadaNoCorroborada' => $this->administrador->noCorroborarJornada($data['data']['idJornada']) ?: []]);
    }


    public function notificacionAceptada($data) {
        if (!isset($data['data']['idausencia'])) {
            $this->jsonResponse(['error' => 'Falta el id de la ausencia'], 400);
        }
        $this->jsonResponse(['Ausencia' => $this->administrador->notificacionAceptada($data['data']['idausencia']) ?: []]);
    }

    public function notificacionRechazada($data) {
        if (!isset($data['data']['idausencia'])) {
            $this->jsonResponse(['error' => 'Falta el id de la ausencia'], 400);
        }
        $this->jsonResponse(['success' => true, 'AusenciaRechaza' => $this->administrador->notificacionRechazada($data['data']['idausencia']) ?: []]);
    }

    public function agregarCargo($data) {
        if (!isset($data['nombreCargo'])) {
            $this->jsonResponse(['error' => 'Faltan datos'], 400);
        }
        $this->jsonResponse(['success' => true, 'cargo' => $this->administrador->agregarCargo($data['nombreCargo']) ?: []]);
    }

    public function agregarConvocatoria($data) {
        $required = ['nombreConvocatoria', 'descripcion', 'requisitos', 'salario', 'cantidadConvocatoria', 'idcargo'];
        foreach ($required as $key) {
            if (!isset($data[$key])) {
                $this->jsonResponse(['error' => 'Faltan datos'], 400);
            }
        }
        $this->jsonResponse(['Convocatoria' => $this->administrador->agregarConvocatoria($data) ?: []]);
    }
    public function guardarResultadosSistemaDeGestion($data) {
        $required = ['identrevista', 'idpostulacion','estado_salud', 'evaluacionRiesgos', 'recomendaciones', 'aptitudLaboral', 'comentarios', 'estadoEvaluacion'];

        foreach ($required as $key) {
            if (!isset($data[$key]) || empty($data[$key])) {
                $this->jsonResponse(['error' => "Faltan datos: $key"], 400);
                return;
            }
        }
        $resultado = $this->administrador->guardarResultadosSistemaDeGestion($data);

        if ($resultado) {
            $this->jsonResponse(['success' => true, 'message' => 'Resultados guardados con éxito.']);
        } else {
            $this->jsonResponse(['error' => 'No se pudo guardar en la base de datos.'], 500);
        }
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
    public function asignarVinculacion($data){
        $required = ['num_doc', 'fechaInicio', 'fechaFin', 'tipoContrato', 'salario', 'estadoContrato', 'fechaFirma'];
        foreach ($required as $key){
            if(!isset($data[$key])){
                $this->jsonResponse(['error' => 'Faltan datos'], 400);
            }
        }
        $this->jsonResponse(['Vinculacion' => $this->administrador->asignarVinculacion($data) ?: []]);
    }

    public function asistenciaConfirmada($data){
        $required = $data['identrevista'];

        foreach ($required as $key){
            if (!isset($data[$key])){
                $this->jsonResponse(['error' => 'Falta el numero de identificacion de la entrevista'], 400);
            }
            $this->jsonResponse(['Asistencia' => $this->administrador->asistenciaConfirmada($data) ?: []]);
        }
    }

    public function asistenciaNoConfirmada($data){
        $required = $data['identrevista'];

        foreach ($required as $key){
            $this->jsonResponse(['error' => 'Falta el numero de identificacion de la entrevista'] , 400);
        }  
        $this->jsonResponse(['noAsistencia' => $this->administrador->asistenciaNoConfirmada($data) ?: []]);
    }

}
