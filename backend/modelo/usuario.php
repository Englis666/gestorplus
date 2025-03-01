<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


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
            return json_encode(['message' => 'Usuario registrado Correctamente']);
        } catch (PDOException $e) {
            $this->db->rollBack();
            return json_encode(['message' => 'Error al registrar: ' . $e->getMessage()]);
        }
    }

    public function inicioSesion($data){
        date_default_timezone_set('America/Bogota');
    
        $sql = "SELECT * FROM usuario WHERE num_doc = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$data['num_doc']]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($usuario && password_verify($data['password'], $usuario['password'])) {
    
            if ($usuario['rol_idrol'] != 4) {
                $num_doc = $usuario['num_doc'];
                $nombres = $usuario['nombres'];
                $fecha = date('Y-m-d'); 
                $horaEntrada = date('H:i'); 
                $horaSalida = date('H:i', strtotime('+8 hours')); 
                $estadoJornada = 1;
    
                $insertarMiJornada = $this->db->prepare("INSERT INTO jornada (fecha, horaEntrada, horaSalida, usuario_num_doc, estadoJornada) 
                                                          VALUES (?, ?, ?, ?, ?)");
                if ($insertarMiJornada->execute([$fecha, $horaEntrada, $horaSalida, $num_doc, $estadoJornada])) {
    
                    $descripcionNotificacion = "Nueva jornada registrada por inicio de sesión para el usuario con documento: $num_doc y con el nombre $nombres";
                    
                    $insertarNotificacion = $this->db->prepare("INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                                               VALUES (?, ?, ?, ?)");
                    if ($insertarNotificacion->execute([$descripcionNotificacion, 1, 'Jornada', $num_doc])) {
                        return [
                            'num_doc' => $usuario['num_doc'],
                            'nombres' => $usuario['nombres'],
                            'rol' => $usuario['rol_idrol'],  
                            'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
                        ];
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
    
            } else {
                return [
                    'num_doc' => $usuario['num_doc'],
                    'nombres' => $usuario['nombres'],
                    'rol' => $usuario['rol_idrol'],  
                    'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
                ];
            }
    
        } else {
            return false; 
        }
    }
    
    public function datosPerfil($num_doc){
        $sql = "SELECT * FROM usuario as u
                 INNER JOIN hojadevida as h ON u.hojadevida_idHojadevida = h.idHojadevida 
        WHERE num_doc = :num_doc";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
        $stmt->execute();
        
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }

    return [];
    }


    // public function actualizarPerfil($data,$num_doc){
    
    //     $sql = "UPDATE usuario SET num_doc = :num_doc, nombres =:nombres , apellidos = :apellidos, email = :email , tipodDoc = :tipodDoc,
    //             password = :password, 
    //             WHERE num_doc = :num_doc";

    //     $stmt = $this->db->prepare($sql);
    //     $stmt->bindParam(':num_doc', $data['num_doc']);
    //     $stmt->bindParam(':nombres', $data['nombres']);
    //     $stmt->bindParam(':apellidos', $data['apellidos']);
    //     $stmt->bindParam(':email', $data['email']);
    //     $stmt->bindParam(':tipoDoc', $data['tipoDoc']);
    //     $stmt->bindParam(':password', $data['password']);
        
    //     return $stmt->execute();
    
    // }
   
    public function actualizacionHojadeVida($data, $hojadevida_idHojadevida) {
        $query = "UPDATE hojadevida SET 
                    fechaNacimiento = ?,
                    direccion = ?,
                    ciudad = ?,
                    ciudadNacimiento = ?,
                    telefono = ?,
                    telefonoFijo = ?,
                    estadohojadevida = ?
                  WHERE idHojadevida = ?";  
    
        $stmt = $this->db->prepare($query);
    
        $stmt->execute([
            $data['fechaNacimiento'],
            $data['direccion'],
            $data['ciudad'],
            $data['ciudadNacimiento'],
            $data['telefono'],
            $data['telefonoFijo'],
            $data['estadohojadevida'],
            $hojadevida_idHojadevida
        ]);
    
        return json_encode(['message' => 'Hoja de vida actualizada']);
    }

    public function agregarEstudio($data, $hojadevida_idHojadevida) {
        $sql = "INSERT INTO estudio 
                (nivelEstudio, areaEstudio, estadoEstudio, fechaInicioEstudio, 
                fechaFinEstudio, tituloEstudio, institucionEstudio, ubicacionEstudio, hojadevida_idHojadevida) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmtUsuario = $this->db->prepare($sql);    
        $stmtUsuario->execute([
                    $data['nivelEstudio'],
                    $data['areaEstudio'],
                    $data['estadoEstudio'],
                    $data['fechaInicioEstudio'],
                    $data['fechaFinEstudio'],
                    $data['tituloEstudio'],
                    $data['institucionEstudio'],
                    $data['ubicacionEstudio'],
                    $hojadevida_idHojadevida
        ]);    
    
        return json_encode(['message' => 'Experiencia agregada']);
    }

    public function agregarExp($data, $hojadevida_idHojadevida) {
        $sql = "INSERT INTO experienciaLaboral 
                (profesion, descripcionPerfil, fechaInicioExp, fechaFinExp, hojadevida_idHojadevida) 
                VALUES (?, ?, ?, ?, ?)";
        
        $stmtUsuario = $this->db->prepare($sql);    
        
        $stmtUsuario->execute([
            $data['profesion'],
            $data['descripcionPerfil'],
            $data['fechaInicioExp'],
            $data['fechaFinExp'],
            $hojadevida_idHojadevida
        ]);    
    
        return json_encode(['message' => 'Experiencia agregada']);
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

    public function obtenerRRHH() {
        $sql = "SELECT * FROM usuario as u
                INNER JOIN rol as r ON u.rol_idrol = idrol
                WHERE r.nombreRol = 'Recursos humanos'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return [];
    }
    
    
    
    public function obtenerTotalEstadisticas($num_doc) {
        $sql = "
           SELECT 
            SUM(CASE WHEN tipo = 'Jornada' THEN 1 ELSE 0 END) AS totalEntradas,
             SUM(CASE WHEN tipo = 'Ausencia' THEN 1 ELSE 0 END) AS totalAusencias
                FROM notificacion
                    WHERE num_doc = :num_doc
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
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