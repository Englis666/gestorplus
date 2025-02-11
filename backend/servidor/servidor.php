<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$method = $_SERVER['REQUEST_METHOD'];
header("Content-Type: application/json");

require_once 'controlador/chatControlador.php';
require_once 'controlador/administradorControlador.php';
require_once 'controlador/usuarioControlador.php';
require_once 'controlador/aspiranteControlador.php';
require_once 'controlador/empleadoControlador.php';

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action'])) {
            $action = $data['action'];
            switch ($action) {
                // USUARIOS
                case 'registrarse':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->registrar($data);
                    break;
                case 'login':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->iniciar($data);
                    break;
                case 'agregarEstudio':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->agregarEstudio($data);
                    break;
                case 'agregarExp':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->agregarExp($data);
                    break;

                //EMPLEADOS
                case 'solicitarQueja':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->solicitarQueja($data);
                    break;

                case 'solicitarAusencia':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->solicitarAusencia($data);
                    break;
                
                    
                case 'solicitarVacaciones':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->solicitarVacaciones($data);
                    break;

                case 'aplicacionDeAspirante':
                    $aspiranteControlador = new AspiranteControlador();
                    $aspiranteControlador->aplicacionDeAspirante($data);
                    break;

                

                //CHAT
                
                case 'enviarMensajes':
                    $chatControlador = new ChatControlador();
                    $chatControlador->enviarMensajes($data);
                    break;
                case 'iniciarChat':
                    $chatControlador = new ChatControlador();
                    $chatControlador->iniciarChat($data);
                    break;
                
                //ADMINISTRADOR- RECURSOS HUMANOS

                case 'agregarCargo':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->agregarCargo($data);
                    break;

                case 'agregarConvocatoria':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->agregarConvocatoria($data);
                    break;

                case 'corroborarJornada':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->corroborarJornada($data);
                    break;
                case 'noCorroborarJornada':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->noCorroborarJornada($data);
                    break;
                case 'notificacionAceptada':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->notificacionAceptada($data);
                    break;
                case 'notificacionRechazada':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->notificacionRechazada($data);
                    break;

                

                default:
                    http_response_code(400);
                    echo json_encode(['message' => 'Acción no encontrada.']);
                    break;
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'No se recibió la acción.']);
        }
        break;
        
    case 'GET':
        if (isset($_GET['action'])) {
            $action = $_GET['action'];
            switch ($action) {
                //USUARIOS

                case 'obtenerIdChat':
                    $chatControlador = new ChatControlador();
                    $chatControlador->obtenerIdChat();
                    break;

                case 'obtenerMensajes':
                    $chatControlador = new ChatControlador();
                    $chatControlador->obtenerMensajes($data);
                    break;

                case 'obtenerConvocatorias':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->obtenerConvocatorias();
                    break;
                
                case 'obtenerTotalEstadisticas':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->obtenerTotalEstadisticas();
                    break;

                case 'obtenerRRHH':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->obtenerRRHH();
                    break;

                case 'datosPerfil':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->datosPerfil();
                    break;

                //EMPLEADO
                case 'obtenerNotificaciones':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->obtenerNotificaciones();
                    break;
                
                case 'obtenerJornadas':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->obtenerJornadas();
                    break;
                case 'obtenerAusencias':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->obtenerAusencias();
                    break;
                case 'obtenerMisVacaciones':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->obtenerMisVacaciones();
                    break;
                case 'obtenerMiPazYSalvo':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->obtenerMiPazYSalvo();
                    break;

                //ASPIRANTE 
                case 'obtenerNotificaciones':
                    $aspiranteControlador = new AspiranteControlador();
                    $aspiranteControlador->obtenerNotificaciones();
                    break;
                
                case 'obtenerDetalleConvocatoria':
                    $aspiranteControlador = new AspiranteControlador();
                    $aspiranteControlador->obtenerDetalleConvocatoria();
                    break;

                //ADMINISTRADOR RECURSOS HUMANOS
                case 'obtenerCargos':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerCargos();
                    break;
                    
                case 'obtenerPostulaciones':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerPostulaciones();
                    break;

                case 'obtenerEmpleados':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerEmpleados();
                    break;
                    
                case 'obtenerPazYSalvos':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerPazYSalvos();
                    break;

                case 'obtenerConvocatorias':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerConvocatorias();
                    break;
                    
                case 'obtenerTodasLasNotificaciones':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerTodasLasNotificaciones();
                    break;
                case 'obtenerTodasLasJornadas':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerTodasLasJornadas();
                    break;
                case 'obtenerTodasLasAusencias':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerTodasLasAusencias();
                    break;

                case 'obtenerUsuarios':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerUsuarios();
                    break;

                case 'obtenerEntrevistas':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerEntrevistas();    
                    break;

                case 'obtenerTodasLasHorasExtra':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerTodasLasHorasExtra();
                    break;

                case 'obtenerTodasLasVacaciones':
                    $administradorControlador = new AdministradorControlador();
                    $administradorControlador->obtenerTodasLasVacaciones();
                    break;

                default:
                    http_response_code(400);
                    echo json_encode(['message' => 'Acción no encontrada.']);
                    break;
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'No se recibió la acción.']);
        }
        break;

    case 'PATCH':
        $data = json_decode(file_get_contents('php://input'), true);
        if(isset($_GET['action'])){
            $action = $_GET['action'];
            switch($action){
                case 'actualizarPerfil':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->actualizarPerfil($data);
                    break;

                case 'actualizacionHojaDevida':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->actualizacionHojaDevida($data);
                    break;
            default:
                http_response_code(400);
                echo json_encode(['message' => 'Acción no encontrada.']);
                break;
            }
        } else{
            http_response_code(400);
            echo json_encode(['message' => 'No se recibio la accion']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método de solicitud no soportado.']);
        break;
}
?>
