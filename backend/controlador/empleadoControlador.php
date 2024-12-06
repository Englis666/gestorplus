<?php
//MODELOS 
require_once 'modelo/empleado.php';
require_once 'config/config.php';

class EmpleadoControlador {

    private $db;
    private $empleado;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
    }

    public function obtenerNotificaciones(){
        $this->empleado = new Empleado($this->db);
        $resultado = $this->empleado->obtenerNotificaciones();
        
        if($resultado){
            echo json_encode(['Notificaciones' => $resultado]);
        }else{
            echo json_encode(['Notificaciones' => []]);
        }
    }

    public function obtenerJornadas(){
        $this->empleado = new Empleado($this->db);
        $resultado = $this->empleado->obtenerJornadas();
        if($resultado){
            echo json_encode(['Jornadas' => $resultado]);
        }else{
            echo json_encode(['Jornadas' =>[]]);
        }
    }

    public function obtenerAusencias(){
        $this->empleado = new Empleado($this->db);
        $resultado = $this->empleado->obtenerAusencias();
        if($resultado){
            echo json_encode(['Ausencias' => $resultado]);
        }else{
            echo json_encode(['Ausencias' =>[]]);
        }
    }
}
?>