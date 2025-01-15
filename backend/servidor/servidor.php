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

                case 'aplicacionDeAspirante':
                    $aspiranteControlador = new AspiranteControlador();
                    $aspiranteControlador->aplicacionDeAspirante();
                    break;

                case 'obtenerMensajes':
                    $chatControlador = new ChatControlador();
                    $chatControlador->obtenerMensajes($data);
                    break;
        
                case 'enviarMensajes':
                    $chatControlador = new ChatControlador();
                    $chatControlador->enviarMensajes($data);
                    break;
                case 'iniciarChat':
                    $chatControlador = new ChatControlador();
                    $chatControlador->iniciarChat($data);
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
                case 'obtenerConvocatorias':
                    $usuarioControlador = new UsuarioControlador();
                    $usuarioControlador->obtenerConvocatorias();
                    break;
                case 'obtenerNotificaciones':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->obtenerNotificaciones();
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

                case 'obtenerJornadas':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->obtenerJornadas();
                    break;
                case 'obtenerAusencias':
                    $empleadoControlador = new EmpleadoControlador();
                    $empleadoControlador->obtenerAusencias();
                    break;
                case 'obtenerNotificaciones':
                    $aspiranteControlador = new AspiranteControlador();
                    $aspiranteControlador->obtenerNotificaciones();
                    break;
                
                case 'obtenerDetalleConvocatoria':
                    $aspiranteControlador = new AspiranteControlador();
                    $aspiranteControlador->obtenerDetalleConvocatoria();
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
