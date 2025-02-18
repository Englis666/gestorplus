<?php
// MODELO
require_once 'config/config.php';

class Administrador {

    private $db;

    public function __construct($db){
        $this->db = $db;
    }
    public function obtenerCargos(){
        $sql = "SELECT * FROM cargo";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

    public function obtenerEmpleados(){
        $sql = "SELECT * FROM usuario as u
                 INNER JOIN rol as r ON u.rol_idrol = idrol
                 WHERE r.nombreRol = 'Empleados'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

    public function obtenerTodasLasNotificaciones(){
        try{
            $sql = "SELECT * FROM notificacion";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if($resultado){
                return $resultado;
            }
            return [];
        }catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function obtenerTodasLasVacaciones(){
        try{
            $sql = "SELECT * FROM vacacion as v 
                    INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if($resultado){
                return $resultado;
            }
            return [];
        } catch (PDOException $e){
            echo json_encode(['error' => 'Error en la consulta ' . $e->getMessage()]);
            http_response_code(500);
            return[];
        }
    }

        public function verificarRol($num_doc) {
            $sql = "SELECT r.idrol 
                    FROM usuario AS u 
                    INNER JOIN rol AS r ON u.rol_idrol = r.idrol 
                    WHERE u.num_doc = :num_doc";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
            $stmt->execute();
    
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$resultado) {
                return ['error' => 'No se encontró el usuario'];
            }
    
            $idrol = $resultado['idrol'];
    
            // Si es administrador (idrol = 1), obtiene todas las horas extra
            return ($idrol == 1) ? $this->calcularHorasExtra() : $this->calcularHorasExtraUsuario($num_doc);
        }
    
        public function calcularHorasExtra() {
            try {
                // Obtener todas las jornadas laborales
                $sql = "SELECT j.*, u.nombres, r.nombreRol 
                        FROM jornada AS j
                        INNER JOIN usuario AS u ON j.usuario_num_doc = u.num_doc      
                        INNER JOIN rol AS r ON u.rol_idrol = r.idrol";
                
                $stmt = $this->db->prepare($sql);
                $stmt->execute();
                $jornadas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                $totalHorasSemana = []; 
                $jornadasExtra = [];
    
                foreach ($jornadas as $jornada) {
                    $num_doc = $jornada['usuario_num_doc'];
                    $nombres = $jornada['nombres'];
                    $nombreRol = $jornada['nombreRol'];
    
                    if (!isset($totalHorasSemana[$num_doc])) {
                        $totalHorasSemana[$num_doc] = 0;
                    }
    
                    // Calcular las horas trabajadas en la jornada
                    $horaEntrada = strtotime($jornada['horaEntrada']);
                    $horaSalida = strtotime($jornada['horaSalida']);
                    $horasTrabajadas = ($horaSalida - $horaEntrada) / 3600;
    
                    $totalHorasSemana[$num_doc] += $horasTrabajadas;
    
                    if ($totalHorasSemana[$num_doc] > 48) {
                        $horasExtra = $totalHorasSemana[$num_doc] - 48;
                        $this->registrarHorasExtra($num_doc, $horasExtra);
                        
                        $jornadasExtra[] = [
                            'num_doc' => $num_doc,
                            'nombres' => $nombres,
                            'nombreRol' => $nombreRol,
                            'horas_extra' => $horasExtra,
                        ];
                    }
                }
    
                return $jornadasExtra;
    
            } catch (PDOException $e) {
                return ['error' => 'Error en la consulta: ' . $e->getMessage()];
            }
        }
    
        public function calcularHorasExtraUsuario($num_doc) {
            try {
                // Obtener las jornadas del usuario
                $sql = "SELECT * FROM jornada WHERE usuario_num_doc = :num_doc";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
                $stmt->execute();
                $jornadas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                $totalHorasSemana = 0;
                $horasExtra = 0;
    
                foreach ($jornadas as $jornada) {
                    $horaEntrada = strtotime($jornada['horaEntrada']);
                    $horaSalida = strtotime($jornada['horaSalida']);
                    $horasTrabajadas = ($horaSalida - $horaEntrada) / 3600;
    
                    $totalHorasSemana += $horasTrabajadas;
                }
    
                if ($totalHorasSemana > 48) {
                    $horasExtra = $totalHorasSemana - 48;
                    $this->registrarHorasExtra($num_doc, $horasExtra);
                }
    
                return [
                    'num_doc' => $num_doc,
                    'horas_extra' => $horasExtra,
                ];
    
            } catch (PDOException $e) {
                return ['error' => 'Error en la consulta: ' . $e->getMessage()];
            }
        }
    
        private function registrarHorasExtra($num_doc, $horasExtra) {
            // Verificar si ya existe un registro para hoy
            $sql_check = "SELECT horasExtra FROM horaextra WHERE usuario_num_doc = :usuario_num_doc AND DATE(fecha) = CURDATE()";
            $stmt_check = $this->db->prepare($sql_check);
            $stmt_check->bindParam(':usuario_num_doc', $num_doc);
            $stmt_check->execute();
    
            if ($stmt_check->rowCount() > 0) {
                $existing_hours = $stmt_check->fetch(PDO::FETCH_ASSOC)['horasExtra'];
                if ($horasExtra > $existing_hours) {
                    $sql_update = "UPDATE horaextra 
                                   SET horasExtra = :horasExtra
                                   WHERE usuario_num_doc = :usuario_num_doc AND DATE(fecha) = CURDATE()";
                    $stmt_update = $this->db->prepare($sql_update);
                    $stmt_update->bindParam(':usuario_num_doc', $num_doc);
                    $stmt_update->bindParam(':horasExtra', $horasExtra);
                    $stmt_update->execute();
                }
            } else {
                $sql_insert = "INSERT INTO horaextra (usuario_num_doc, horasExtra, fecha) 
                               VALUES (:usuario_num_doc, :horasExtra, CURDATE())";
                $stmt_insert = $this->db->prepare($sql_insert);
                $stmt_insert->bindParam(':usuario_num_doc', $num_doc);
                $stmt_insert->bindParam(':horasExtra', $horasExtra);
                $stmt_insert->execute();
            }
        }

    public function obtenerConvocatorias(){
        $sql = "SELECT * FROM convocatoria";
        $stmt = $this->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
    
    }


    public function obtenerTodasLasJornadas(){
        try{
            $sql = "SELECT * FROM jornada as j
                    INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc;
                    ";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            if($resultado){
                return $resultado;
            }
        }catch (PDOException $e) {
        echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
        http_response_code(500);
        return [];
        }
    }

    public function obtenerTodasLasAusencias(){
        try{
            $sql = "SELECT * FROM ausencia";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if($resultado){
                return $resultado;
            }
        }catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
            http_response_code(500);
            return [];
        }
    }

    public function obtenerUsuarios(){
        $sql = "SELECT * FROM usuario as u
                 INNER JOIN rol as r ON u.rol_idrol = idrol
                 WHERE r.nombreRol = 'Empleados'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

    public function obtenerEntrevistas(){
        $sql = "SELECT * FROM entrevista as e 
                INNER JOIN postulacion as p ON e.postulacion_idpostulaciones =  idpostulacion
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }


    public function corroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 1 WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }
    public function noCorroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 0 WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }

    public function notificacionAceptada($idausencia){
        $sql = "UPDATE ausencia SET justificada = 1 WHERE idausencia = :idausencia";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $descripcionNotificacion = "Ausencia aceptada";
            $tipo = "Aceptacion";
            $insertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, tipo) VALUES (?, ?)";
            $stmt = $this->db->prepare($insertarNotificacion);
            $stmt->bindParam(1, $descripcionNotificacion, PDO::PARAM_STR);
            $stmt->bindParam(2, $tipo, PDO::PARAM_STR);
            $stmt->execute();
            
            return true; 
        } else {
            return false;
        }
    }
    
    public function notificacionRechazada($idausencia){
        $sql = "UPDATE ausencia SET justificada = 0 WHERE idausencia = :idausencia";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $descripcionNotificacion = "Ausencia rechazada";
            $tipo = "Rechazo";
            $insertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, tipo) VALUES (?, ?)";
            $stmt = $this->db->prepare($insertarNotificacion);
            $stmt->bindParam(1, $descripcionNotificacion, PDO::PARAM_STR);
            $stmt->bindParam(2, $tipo, PDO::PARAM_STR);
            $stmt->execute();
            
            return true; 
        } else {
            return false; 
        }
    }
    public function agregarCargo($nombreCargo){
        $sql = "INSERT INTO cargo (nombreCargo, estadoCargo) VALUES (?, ?)";
        $stmt = $this->db->prepare($sql);
        if ($stmt->execute([$nombreCargo, "1"])) {
            return $this->db->lastInsertId(); // Devuelve el ID del cargo insertado
        }
        return false;
    }
    
    public function agregarConvocatoria($data){
        $sql = "INSERT INTO convocatoria (nombreConvocatoria,descripcion,requisitos, salario,
                        cantidadConvocatoria)
                                             VALUES ( ? , ? , ? , ? , ?)";
         $stmt = $this->db->prepare($sql);
         $stmt->execute([
             $data['nombreConvocatoria'],
             $data['descripcion'],
             $data['requisitos'],
             $data['salario'],
             $data['cantidadConvocatoria'],
         ]);
        return;
    }
     public function asignarEntrevista($data){
         $estado = "Pendiente";
         $sql = "INSERT INTO entrevista (fecha,hora,lugarMedio,postulacion_idpostulaciones, estadoEntrevista)
                                         VALUES(? , ? , ? , ? , ?)";
         $stmt = $this->db->prepare($sql);
         $stmt->execute([
             $data['fecha'],
             $data['hora'],
             $data['lugarMedio'],
             $data['postulacion_idpostulaciones'],
             $estado
         ]);
         return;
    }


    public function obtenerPazYSalvos(){
        $sql = "SELECT * FROM pazysalvo";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

   

    public function obtenerPostulaciones(){
        $sql = "SELECT * FROM postulacion as p
                INNER JOIN usuario as u. ON p.usuario_num_doc = u.num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo
                ";
        $sql = "SELECT * FROM usuario as u
                INNER JOIN postulacion as p ON u.num_doc = p.usuario_num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }

    public function asitenciaConfirmada($data){
        $sql = "UPDATE entrevista SET estadoEntrevista = 'Asistencia' WHERE identrevista = :identrevista";
        $stmt = $this->db-prepare($sql);
        $stmt->bindParam(':identrevista', $data['identrevista'] , PDO::PARAM_INT);
        return;
    }

    public function asistenciaNoConfirmada($data){
        $sql = "UPDATE entrevista SET estadoEntrevista = 'No asistio' WHERE identrevista = :identrevista";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(":identrevista" , $data['identrevista'], PDO::PARAM_INT);
        return;
    }
    
}



?>