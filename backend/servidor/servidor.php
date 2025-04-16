<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");

use Controlador\UsuarioControlador;
use Controlador\ChatControlador;
use Controlador\AdministradorControlador;
use Controlador\AspiranteControlador;
use Controlador\EmpleadoControlador;
use Controlador\CalculoControlador;
use Controlador\PublicacionesControlador;

// Obtener método y datos
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$action = $_GET['action'] ?? ($data['action'] ?? null);

// Validar acción
if (!$action) {
    http_response_code(400);
    echo json_encode(['message' => 'No se recibió la acción.']);
    exit;
}

// Instanciar controladores
$controllers = [
    'usuario' => new UsuarioControlador(),
    'empleado' => new EmpleadoControlador(),
    'aspirante' => new AspiranteControlador(),
    'chat' => new ChatControlador(),
    'admin' => new AdministradorControlador(),
    'calculo' => new CalculoControlador(),
    'publicaciones' => new PublicacionesControlador(),
];

// Rutas organizadas por método HTTP
$routes = [
    'POST' => [
        // Usuario
        'registrarse' => ['usuario', 'registrar'],
        'login' => ['usuario', 'iniciar'],
        'agregarEstudio' => ['usuario', 'agregarEstudio'],
        'agregarExp' => ['usuario', 'agregarExp'],
        'registroHorasExtra' => ['usuario', 'registroHorasExtra'],
        'consultarEstudio' => ['usuario', 'consultarEstudio'],
        'consultarExp' => ['usuario', 'consultarExp'],

        // Empleado
        'solicitarQueja' => ['empleado', 'solicitarQueja'],
        'solicitarAusencia' => ['empleado', 'solicitarAusencia'],
        'solicitarVacaciones' => ['empleado', 'solicitarVacaciones'],
        'solicitarPermiso' => ['empleado', 'solicitarPermiso'],

        // Aspirante
        'aplicacionDeAspirante' => ['aspirante', 'aplicacionDeAspirante'],

        // Chat
        'enviarMensaje' => ['chat', 'enviarMensaje'],
        'obtenerOcrearChat' => ['chat', 'obtenerOcrearChat'],
        'iniciarChat' => ['chat', 'iniciarChat'],

        // Admin
        'agregarCargo' => ['admin', 'agregarCargo'],
        'guardarResultadosSistemaDeGestion' => ['admin', 'guardarResultadosSistemaDeGestion'],
        'agregarConvocatoria' => ['admin', 'agregarConvocatoria'],
        'corroborarJornada' => ['admin', 'corroborarJornada'],
        'noCorroborarJornada' => ['admin', 'noCorroborarJornada'],
        'notificacionAceptada' => ['admin', 'notificacionAceptada'],
        'notificacionRechazada' => ['admin', 'notificacionRechazada'],
        'aceptarVacacion' => ['admin', 'aceptarVacacion'],
        'rechazarVacacion' => ['admin' , 'aceptarVacacion'],
        'asignarEntrevista' => ['admin', 'asignarEntrevista'],
        'asignarVinculacion' => ['admin', 'asignarVinculacion'],
        'asistenciaConfirmada' => ['admin', 'asistenciaConfirmada'],
        'asistenciaNoConfirmada' => ['admin', 'asistenciaNoConfirmada'],
        'permisoAceptado' => ['admin', 'permisoAceptado'],
        'permisoRechazado' => ['admin' , 'permisoRechazado'],
        'agregarPublicacion' => ['publicaciones' , 'agregarPublicacion']
    ],
    'GET' => [
        // Usuario
        'obtenerConvocatorias' => ['usuario', 'obtenerConvocatorias'],
        'obtenerTotalEstadisticas' => ['usuario', 'obtenerTotalEstadisticas'],
        'obtenerRRHH' => ['usuario', 'obtenerRRHH'],
        'datosPerfil' => ['usuario', 'datosPerfil'],
        'obtenerDatosParaCertificado' => ['usuario', 'obtenerDatosParaCertificado'],
        'obtenerNotificaciones' => ['usuario', 'obtenerNotificaciones'],
        'obtenerEstudio' => ['usuario', 'obtenerEstudio'],
        'obtenerExperiencia' => ['usuario', 'obtenerExperiencia'],

        // Empleado
        'obtenerJornadas' => ['empleado', 'obtenerJornadas'],
        'obtenerAusencias' => ['empleado', 'obtenerAusencias'],
        'obtenerMisVacaciones' => ['empleado', 'obtenerMisVacaciones'],
        'obtenerMiPazySalvo' => ['empleado', 'obtenerMiPazYSalvo'],
        'obtenerPermisos' => ['empleado', 'obtenerPermisos'],

        // Aspirante
        'obtenerPostulacionesAspirante' => ['aspirante', 'obtenerPostulacionesAspirante'],
        'obtenerDetalleConvocatoria' => ['aspirante', 'obtenerDetalleConvocatoria'],
        'verificarPostulacion' => ['aspirante', 'verificarPostulacion'],
        'obtenerNotificacionesAspirante' => ['aspirante', 'obtenerNotificacionesAspirante'],

        // Chat
        'obtenerMensajes' => ['chat', 'obtenerMensajes'],

        // Admin
        'obtenerVinculaciones' => ['admin', 'obtenerVinculaciones'],
        'obtenerCargos' => ['admin', 'obtenerCargos'],
        'obtenerPostulaciones' => ['admin', 'obtenerPostulaciones'],
        'obtenerEmpleados' => ['admin', 'obtenerEmpleados'],
        'obtenerPazYSalvos' => ['admin', 'obtenerPazYSalvos'],
        'obtenerTodasLasNotificaciones' => ['admin', 'obtenerTodasLasNotificaciones'],
        'obtenerTodasLasJornadas' => ['admin', 'obtenerTodasLasJornadas'],
        'obtenerTodasLasAusencias' => ['admin', 'obtenerTodasLasAusencias'],
        'obtenerUsuarios' => ['admin', 'obtenerUsuarios'],
        'obtenerCargosParaConvocatorias' => ['admin', 'obtenerCargosParaConvocatorias'],
        'obtenerEntrevistas' => ['admin', 'obtenerEntrevistas'],
        'obtenerTodasLasHorasExtra' => ['admin', 'obtenerTodasLasHorasExtra'],
        'obtenerTodasLasVacaciones' => ['admin', 'obtenerTodasLasVacaciones'],
        'obtenerDatosDelEntrevistado' => ['admin', 'obtenerDatosDelEntrevistado'],
        'obtenerTodasLasEstadisticas' => ['admin', 'obtenerTodasLasEstadisticas'],
        'obtenerSistemaDeGestion' => ['admin', 'obtenerSistemaDeGestion'],
        'buscarIdEvaluacion' => ['admin', 'buscarIdEvaluacion'],
        'obtenerTodosLosPermisos' => ['admin' , 'obtenerTodosLosPermisos'],
        
        //Calculo
        'calcularPostulacionesEnConvocatorias' => ['calculo', 'calcularPostulacionesEnConvocatorias'],
        'calcularHorasExtra' =>  ['calculo', 'calcularHorasExtra'],
        'obtenerMinutosTrabajadosDelEmpleado' => ['calculo', 'obtenerMinutosTrabajadosDelEmpleado'],
        'obtenerMinutosTrabajados' => ['calculo' , 'obtenerMinutosTrabajados'],

        //Publicacion
        'obtenerPublicacionPorTipoDeContrato' => ['publicaciones', 'obtenerPublicacionPorTipoDeContrato'],

    ],
    'PATCH' => [
        'actualizarPerfil' => ['usuario', 'actualizarPerfil'],
        'actualizacionHojaDevida' => ['usuario', 'actualizacionHojaDevida'],
        'actualizarPublicacion' => ['publicaciones' , 'actualizarPublicacion'],
    ],
    'DELETE' => [
        'eliminarEstudio' => ['usuario', 'eliminarEstudio'],
        'eliminarExperiencia' => ['usuario', 'eliminarExperiencia'],
        'eliminarPublicacion' => ['publicaciones' , 'eliminarPublicacion'],
    ],
];

// Ejecutar acción
if (isset($routes[$method][$action])) {
    [$controllerKey, $methodToCall] = $routes[$method][$action];
    if (method_exists($controllers[$controllerKey], $methodToCall)) {
        $controllers[$controllerKey]->$methodToCall($data);
        exit;
    } else {
        http_response_code(500);
        echo json_encode([
            'message' => 'El método no existe en el controlador.',
            'controller' => $controllerKey,
            'method' => $methodToCall
        ]);
        exit;
    }
} else {
    http_response_code(404);
    echo json_encode([
        'message' => 'Acción no encontrada.',
        'method' => $method,
        'action' => $action,
        'routes' => array_keys($routes[$method] ?? [])
    ]);
    exit;
}
