<?php
require_once 'config/config.php';
class Usuario {

    private $db;
    public function __construct($db){
        $this->db = $db;
    }

    //cambios
    public function registrar($data) {
        try {
            $this->db->beginTransaction();
            $sqlHojaDeVida = "INSERT INTO hojadevida () VALUES ()"; 
            $stmtHojaDeVida = $this->db->prepare($sqlHojaDeVida);
            $stmtHojaDeVida->execute();

            $idHojadevida = $this->db->lastInsertId();
            $sqlUsuario = "INSERT INTO usuario (num_doc, nombres, apellidos, email, tipodDoc, password, estado, rol_idrol, hojadevida_idHojadevida) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtUsuario = $this->db->prepare($sqlUsuario);    
            $stmtUsuario->execute([
                $data['num_doc'],
                $data['nombres'],
                $data['apellidos'],
                $data['email'],
                $data['tipodDoc'],
                $data['password'],
                $data['estado'],
                $data['rol_idrol'],
                $idHojadevida 
            ]);
            $this->db->commit();
            return json_encode(['message' => 'Usuario registrado']);       
        } catch (PDOException $e) {
            $this->db->rollBack();
            return json_encode(['message' => 'Error al registrar: ' . $e->getMessage()]);
        }
    }

    public function inicioSesion($data){
        // Configurar la zona horaria para Bogotá
        date_default_timezone_set('America/Bogota');
    
        // Consulta para verificar al usuario
        $sql = "SELECT * FROM usuario WHERE num_doc = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$data['num_doc']]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
        // Si el usuario existe y la contraseña es correcta
        if ($usuario && password_verify($data['password'], $usuario['password'])) {
    
            // Iniciar la sesión
            session_start(); 
            $_SESSION['usuario'] = [
                'num_doc' => $usuario['num_doc'],
                'nombres' => $usuario['nombres'],
                'rol' => $usuario['rol_idrol'],  
                'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
            ];
    
            // Verificar si el rol del usuario es diferente a 4
            if ($usuario['rol_idrol'] != 4) {
    
                // Obtener los datos para registrar la jornada y la notificación
                $num_doc = $usuario['num_doc'];
                $nombres = $usuario['nombres'];
                $fecha = date('Y-m-d'); // Fecha actual en la zona horaria de Bogotá
                $horaEntrada = date('H:i'); // Hora de entrada actual en la zona horaria de Bogotá
                $horaSalida = date('H:i', strtotime('+8 hours')); // Hora de salida (8 horas de jornada)
                $estadoJornada = 1; // Estado de la jornada (activo)
    
                // 1. Insertar la jornada automáticamente al iniciar sesión
                $insertarMiJornada = $this->db->prepare("INSERT INTO jornada (fecha, horaEntrada, horaSalida, usuario_num_doc, estadoJornada) 
                                                          VALUES (?, ?, ?, ?, ?)");
                if ($insertarMiJornada->execute([$fecha, $horaEntrada, $horaSalida, $num_doc, $estadoJornada])) {
    
                    // 2. Insertar la notificación
                    $descripcionNotificacion = "Nueva jornada registrada por inicio de sesión para el usuario con documento: $num_doc y con el nombre $nombres";
                    
                    $insertarNotificacion = $this->db->prepare("INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                                               VALUES (?, ?, ?, ?)");
                    if ($insertarNotificacion->execute([$descripcionNotificacion, 1, 'Jornada', $num_doc])) {
                        // Si ambas inserciones fueron exitosas, retornar los datos del usuario
                        return [
                            'num_doc' => $usuario['num_doc'],
                            'nombres' => $usuario['nombres'],
                            'rol' => $usuario['rol_idrol'],  
                            'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
                        ];
                    } else {
                        // Si hubo un error en la inserción de la notificación, manejarlo aquí
                        return false;
                    }
                } else {
                    // Si hubo un error al insertar la jornada, manejarlo aquí
                    return false;
                }
    
            } else {
                // Si el rol es 4, no registrar jornada ni notificación
                return [
                    'num_doc' => $usuario['num_doc'],
                    'nombres' => $usuario['nombres'],
                    'rol' => $usuario['rol_idrol'],  
                    'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
                ];
            }
    
        } else {
            // Si el usuario no existe o la contraseña es incorrecta
            return false; 
        }
    }
    
   

    public function obtenerConvocatorias(){
        $sql = "SELECT * FROM convocatoria as c
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
    return [];
    }

    public function obtenerTotalEstadisticas() {
        $sql = "
            SELECT 
                SUM(CASE WHEN tipo = 'Jornada' THEN 1 ELSE 0 END) AS totalEntradas,
                SUM(CASE WHEN tipo = 'Ausencias' THEN 1 ELSE 0 END) AS totalAusencias
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
}

?>