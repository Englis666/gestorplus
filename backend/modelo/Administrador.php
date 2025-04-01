<?php
namespace Modelo;

use Config\Database;
use PDO;
use PDOException;

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

    public function obtenerSistemaDeGestion(){
        $sql = "SELECT * FROM evaluacionessg as e 
                INNER JOIN postulacion as p ON e.entrevista_postulacion_idpostulaciones = p.idpostulacion
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc";
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
    public function obtenerTotalEstadisticas() {
        $sql = "
           SELECT 
            SUM(CASE WHEN tipo = 'Jornada' THEN 1 ELSE 0 END) AS totalEntradas,
            SUM(CASE WHEN tipo = 'Ausencia' THEN 1 ELSE 0 END) AS totalAusencias
           FROM notificacion
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
    
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($resultado) {
            return [
                'totalEntradas' => (int)$resultado['totalEntradas'],    
                'totalAusencias' => (int)$resultado['totalAusencias']
            ];
        } else {
            return [
                'totalEntradas' => 0,
                'totalAusencias' => 0
            ];
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

    public function obtenerVinculaciones(){
        $sql = "SELECT * FROM vinculacion as v INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc;";
        $stmt = $this->db->prepare($sql);
        
        
        if($stmt->execute()){
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $resultado ?: [];
        }
        
        return [];
    }

    public function obtenerDatosDelEntrevistado($num_doc){
    $sql = "SELECT * FROM postulacion as p
            INNER JOIN entrevista as e ON p.idpostulacion = e.postulacion_idpostulaciones
            INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
            INNER JOIN hojadevida as h ON u.hojadevida_idHojadevida = h.idHojadevida
            WHERE u.num_doc = :num_doc";
    
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(":num_doc", $num_doc, PDO::PARAM_INT);
    $stmt->execute();
    
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC); 

    if (!$resultado) {
        return ['error' => 'No se encontró el usuario'];
    }

    return $resultado; 
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
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    
    }


    public function obtenerTodasLasJornadas(){
        try{
            $sql = "SELECT * FROM jornada as j
                    INNER JOIN usuario as u ON j.usuario_num_doc = u.num_doc
                    WHERE NOT estadoJornada = 'Jornada Corroborada'
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
            $sql = "SELECT * FROM ausencia WHERE NOT justificada = 'Justificada'";
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
                 INNER JOIN rol as r ON u.rol_idrol = r.idrol
                 WHERE r.nombreRol = 'Empleados'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }
    public function obtenerCargosParaConvocatorias(){
        $sql = "SELECT idCargo , nombreCargo FROM cargo";
        $stmt =  $this->db->prepare($sql);
        $stmt->execute();

        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado) {
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

      public function buscarIdEvaluacion($identrevista) {
        $stmt = $this->db->prepare("SELECT idevaluacion FROM evaluacionessg WHERE entrevista_identrevista = ?");
        $stmt->execute([$identrevista]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function corroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 'Jornada Corroborada' WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }
    public function noCorroborarJornada($idJornada){
        $sql = "UPDATE jornada SET estadoJornada = 'Jornada rechazada' WHERE idjornada = :idjornada";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idjornada', $idJornada, PDO::PARAM_INT);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }

    public function notificacionAceptada($idausencia) {
    // Actualizar ausencia
    $sql = "UPDATE ausencia SET justificada = 'Justificada' WHERE idausencia = :idausencia";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
    $stmt->execute();

    // Obtener el num_doc del usuario
    $sqlObtenerNumDoc = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
    $stmtNumDoc = $this->db->prepare($sqlObtenerNumDoc);
    $stmtNumDoc->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
    $stmtNumDoc->execute();
    $numDoc = $stmtNumDoc->fetchColumn(); // Extraer el valor

    if ($stmt->execute()) {
        $descripcionNotificacion = "Ausencia aceptada";
        $tipo = "Aceptacion";

        // Insertar la notificación con num_doc
        $insertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, tipo, num_doc) VALUES (?, ?, ?)";
        $stmtNotificacion = $this->db->prepare($insertarNotificacion);
        $stmtNotificacion->bindParam(1, $descripcionNotificacion, PDO::PARAM_STR);
        $stmtNotificacion->bindParam(2, $tipo, PDO::PARAM_STR);
        $stmtNotificacion->bindParam(3, $numDoc, PDO::PARAM_STR); // Agregar num_doc
        $stmtNotificacion->execute();

        if ($stmtNotificacion->execute()){ 
            $lastId = $this->db->lastInsertId();
            $insertarTablaRelacional = "INSERT INTO ausencia_has_notificacion (notificacion_idnotificacion, ausencia_idausencia) VALUES (?, ?)";
            $stmtRelacional = $this->db->prepare($insertarTablaRelacional);
            $stmtRelacional->bindParam(1, $lastId, PDO::PARAM_INT);
            $stmtRelacional->bindParam(2, $idausencia, PDO::PARAM_INT);
            $stmtRelacional->execute();
            return true;
        }
    } else {
        return false;
    }
}

    public function notificacionRechazada($idausencia) {
        // Actualizar ausencia
        $sql = "UPDATE ausencia SET justificada = 'Rechazada' WHERE idausencia = :idausencia";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        $stmt->execute();

        // Obtener el num_doc del usuario
        $sqlObtenerNumDoc = "SELECT usuario_num_doc FROM ausencia WHERE idausencia = :idausencia";
        $stmtNumDoc = $this->db->prepare($sqlObtenerNumDoc);
        $stmtNumDoc->bindParam(':idausencia', $idausencia, PDO::PARAM_INT);
        $stmtNumDoc->execute();
        $numDoc = $stmtNumDoc->fetchColumn(); // Extraer el valor

        if ($stmt->execute()) {
            $descripcionNotificacion = "Ausencia rechazada";
            $tipo = "Rechazo";

            // Insertar la notificación con num_doc
            $insertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, tipo, num_doc) VALUES (?, ?, ?)";
            $stmtNotificacion = $this->db->prepare($insertarNotificacion);
            $stmtNotificacion->bindParam(1, $descripcionNotificacion, PDO::PARAM_STR);
            $stmtNotificacion->bindParam(2, $tipo, PDO::PARAM_STR);
            $stmtNotificacion->bindParam(3, $numDoc, PDO::PARAM_STR); // Agregar num_doc
            $stmtNotificacion->execute();

            if ($stmtNotificacion->execute()){ 
                $lastId = $this->db->lastInsertId();
                $insertarTablaRelacional = "INSERT INTO ausencia_has_notificacion (notificacion_idnotificacion, ausencia_idausencia) VALUES (?, ?)";
                $stmtRelacional = $this->db->prepare($insertarTablaRelacional);
                $stmtRelacional->bindParam(1, $lastId, PDO::PARAM_INT);
                $stmtRelacional->bindParam(2, $idausencia, PDO::PARAM_INT);
                $stmtRelacional->execute();
                return true;
            }

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
                        cantidadConvocatoria, cargo_idcargo)
                                             VALUES ( ? , ? , ? , ? , ? , ?)";
         $stmt = $this->db->prepare($sql);
         $stmt->execute([
             $data['nombreConvocatoria'],
             $data['descripcion'],
             $data['requisitos'],
             $data['salario'],
             $data['cantidadConvocatoria'],
             $data['idcargo'],
         ]);
        return;
    }
    public function guardarResultadosSistemaDeGestion($data){
    $sql = "INSERT INTO evaluacionessg 
            (estado_salud, evaluacionRiesgos, recomendaciones, aptitudLaboral, comentarios, 
             entrevista_identrevista, entrevista_postulacion_idpostulaciones, estadoEvaluacion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    try {
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['estado_salud'],
            $data['evaluacionRiesgos'],
            $data['recomendaciones'],
            $data['aptitudLaboral'],
            $data['comentarios'], 
            $data['identrevista'],
            $data['idpostulacion'],
            $data['estadoEvaluacion'],
        ]);
        return true;
    } catch (PDOException $e) {
        error_log('Error en guardarResultadosSistemaDeGestion: ' . $e->getMessage());
        return false;
    }
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

    public function asignarVinculacion($data){
    $sql = "INSERT INTO vinculacion (fechaInicio, fechaFin, tipoContrato, salario, estadoContrato, fechaFirma, evaluacionesSg_idevaluacion, usuario_num_doc)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
        $data['fechaInicio'],
        $data['fechaFin'],
        $data['tipoContrato'],
        $data['salario'],
        $data['estadoContrato'], 
        $data['fechaFirma'], 
        $data['idevaluacion'] ?? null, 
        $data['num_doc']
    ]);

    return $stmt->rowCount() > 0; 
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