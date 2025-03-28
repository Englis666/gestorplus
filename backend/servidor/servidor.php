<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

use Controlador\ChatControlador;
use Controlador\AdministradorControlador;
use Controlador\UsuarioControlador;
use Controlador\AspiranteControlador;
use Controlador\EmpleadoControlador;

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? ($data['action'] ?? null);

if (!$action) {
    http_response_code(400);
    echo json_encode(['message' => 'No se recibió la acción.']);
    exit;
}

$controllers = [
    'usuario' => new UsuarioControlador(),
    'empleado' => new EmpleadoControlador(),
    'aspirante' => new AspiranteControlador(),
    'chat' => new ChatControlador(),
    'admin' => new AdministradorControlador()
];


$routes = [
    'POST' => [
        'registrarse' => ['usuario', 'registrar'],
        'login' => ['usuario', 'iniciar'],
        'agregarEstudio' => ['usuario', 'agregarEstudio'],
        'agregarExp' => ['usuario', 'agregarExp'],
        'registroHorasExtra' => ['usuario', 'agregarHorasExtra'],
        'consultarEstudio' => ['usuario', 'consultarEstudio'],
        'consultarExp' => ['usuario', 'consultarExp'],

        'solicitarQueja' => ['empleado', 'solicitarQueja'],
        'solicitarAusencia' => ['empleado', 'solicitarAusencia'],
        'solicitarVacaciones' => ['empleado', 'solicitarVacaciones'],
        
        'aplicacionDeAspirante' => ['aspirante', 'aplicacionDeAspirante'],
        
        'enviarMensaje' => ['chat', 'enviarMensaje'],
        'obtenerOcrearChat' => ['chat' , 'obtenerOcrearChat'],
        'iniciarChat' => ['chat', 'iniciarChat'],
        
        'agregarCargo' => ['admin', 'agregarCargo'],
        'guardarResultadosSistemaDeGestion' => ['admin' , 'guardarResultadosSistemaDeGestion'],
        'agregarConvocatoria' => ['admin', 'agregarConvocatoria'],
        'corroborarJornada' => ['admin', 'corroborarJornada'],
        'noCorroborarJornada' => ['admin', 'noCorroborarJornada'],
        'notificacionAceptada' => ['admin', 'notificacionAceptada'],
        'notificacionRechazada' => ['admin', 'notificacionRechazada'],
        'asignarEntrevista' => ['admin', 'asignarEntrevista'],
        'asistenciaConfirmada' => ['admin', 'asistenciaConfirmada'],
        'asistenciaNoConfirmada' => ['admin', 'asistenciaNoConfirmada']
    ],
    'GET' => [
        'consultarHorasExtra' => ['usuario', 'agregarHorasExtra'],
        
        'obtenerMensajes' => ['chat', 'obtenerMensajes'],
        
        'obtenerConvocatorias' => ['usuario', 'obtenerConvocatorias'],
        'obtenerTotalEstadisticas' => ['usuario', 'obtenerTotalEstadisticas'],
        'obtenerRRHH' => ['usuario', 'obtenerRRHH'],
        'datosPerfil' => ['usuario', 'datosPerfil'],
        'obtenerDatosParaCertificado' => ['usuario', 'obtenerDatosParaCertificado'],
        'obtenerNotificaciones' => ['usuario', 'obtenerNotificaciones'],
        'obtenerDatosParaCertificado' => ['usuario' , 'obtenerDatosParaCertificado'],
        'obtenerJornadas' => ['empleado', 'obtenerJornadas'],
        'obtenerAusencias' => ['empleado', 'obtenerAusencias'],
        'obtenerMisVacaciones' => ['empleado', 'obtenerMisVacaciones'],
        'obtenerMiPazySalvo' => ['empleado', 'obtenerMiPazYSalvo'],
        
        'obtenerPostulacionesAspirante' => ['aspirante', 'obtenerPostulacionesAspirante'],
        'obtenerDetalleConvocatoria' => ['aspirante', 'obtenerDetalleConvocatoria'],
        'verificarPostulacion' => ['aspirante', 'verificarPostulacion'],
        
        'obtenerVinculaciones' => ['admin', 'obtenerVinculaciones'], 
        'obtenerCargos' => ['admin', 'obtenerCargos'],
        'obtenerPostulaciones' => ['admin', 'obtenerPostulaciones'],
        'obtenerEmpleados' => ['admin', 'obtenerEmpleados'],
        'obtenerPazYSalvos' => ['admin', 'obtenerPazYSalvos'],
        'obtenerTodasLasNotificaciones' => ['admin', 'obtenerTodasLasNotificaciones'],
        'obtenerTodasLasJornadas' => ['admin', 'obtenerTodasLasJornadas'],
        'obtenerTodasLasAusencias' => ['admin', 'obtenerTodasLasAusencias'],
        'obtenerUsuarios' => ['admin', 'obtenerUsuarios'],
        'obtenerCargosParaConvocatorias' => ['admin' , 'obtenerCargosParaConvocatorias'],
        'obtenerEntrevistas' => ['admin', 'obtenerEntrevistas'],
        'obtenerTodasLasHorasExtra' => ['admin', 'obtenerTodasLasHorasExtra'],
        'obtenerTodasLasVacaciones' => ['admin', 'obtenerTodasLasVacaciones'],
        'obtenerDatosDelEntrevistado' => ['admin', 'obtenerDatosDelEntrevistado'],
        'obtenerTodasLasEstadisticas' => ['admin' , 'obtenerTodasLasEstadisticas'],
        'obtenerSistemaDeGestion' => ['admin' , 'obtenerSistemaDeGestion']
    ],
    'PATCH' => [
        'actualizarPerfil' => ['usuario', 'actualizarPerfil'],
        'actualizacionHojaDevida' => ['usuario', 'actualizacionHojaDevida']
    ]
];

if (isset($routes[$method][$action])) {
    [$controllerKey, $method] = $routes[$method][$action];
    $controllers[$controllerKey]->$method($data);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Acción no encontrada.']);
}
