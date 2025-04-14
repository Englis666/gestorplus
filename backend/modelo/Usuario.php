<?php
namespace Modelo;
use PDO;
use PDOException;
use Config\Database;

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
                $estadoJornada = "Pendiente";
    
                $insertarMiJornada = $this->db->prepare("INSERT INTO jornada (fecha, horaEntrada, horaSalida, usuario_num_doc, estadoJornada) 
                                                          VALUES (?, ?, ?, ?, ?)");
                if ($insertarMiJornada->execute([$fecha, $horaEntrada, $horaSalida, $num_doc, $estadoJornada])) {
    
                    $descripcionNotificacion = "Nueva jornada registrada por inicio de sesión para el usuario con documento: $num_doc y con el nombre $nombres";
                    
                    $insertarNotificacion = $this->db->prepare("INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                                               VALUES (?, ?, ?, ?)");
                    if ($insertarNotificacion->execute([$descripcionNotificacion, 'Jornada Registrada', 'Jornada', $num_doc])) {
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

    public function obtenerNotificaciones($num_doc){
        try{
            $sql = "SELECT * FROM notificacion WHERE num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
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
            'Activa',
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
    
        return json_encode(['message' => 'Estudio agregado']);
    }

    public function agregarExp($data, $hojadevida_idHojadevida) {
        $sql = "INSERT INTO experiencialaboral 
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
    $sql = "SELECT * FROM usuario AS u
            INNER JOIN rol AS r ON u.rol_idrol = r.idrol
            WHERE r.nombreRol = 'Recursos humanos' OR r.nombreRol = 'Administrador'";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();

    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $resultado ?: [];
}

    public function obtenerDatosParaCertificado($num_doc){
         $sql = "SELECT * FROM vinculacion as v
                 INNER JOIN usuario as u ON v.usuario_num_doc = u.num_doc
                 INNER JOIN rol as r ON u.rol_idrol = r.idrol
                 INNER JOIN evaluacionessg as e ON v.evaluacionesSg_idevaluacion = e.idevaluacion
                 INNER JOIN entrevista as ent ON e.entrevista_identrevista = ent.identrevista
                 INNER JOIN postulacion as p ON ent.postulacion_idpostulaciones = p.idpostulacion
                 INNER JOIN convocatoria as c ON convocatoria_idconvocatoria = c.idconvocatoria
                 INNER JOIN cargo as car ON 
                 c.cargo_idcargo = car.idcargo
                 WHERE u.num_doc = :num_doc
                 ";
        $stmt = $this->db->prepare($sql);
        $stmt->bindPAram(':num_doc' , $num_doc, PDO::PARAM_INT);
        $stmt->execute();

        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($resultado){
            return $resultado;
        }
        return[];
    }

     public function obtenerTotalEstadisticas($num_doc, $rol = null) {
        if ($rol === 'Administrador') {
            return $this->obtenerEstadisticasGlobales();
        }
        return $this->obtenerEstadisticasPorUsuario($num_doc);
    }

    private function obtenerEstadisticasGlobales() {
        $sql = "
            SELECT 
                (SELECT COUNT(*) FROM notificacion WHERE tipo = 'Jornada') AS totalJornadas,
                (SELECT COUNT(*) FROM notificacion WHERE tipo = 'General') AS totalGenerales,
                (SELECT COUNT(*) FROM notificacion 
                    WHERE tipo = 'Rechazo' OR tipo = 'Aceptacion') AS totalActualizaciones
        ";

        // Preparar y ejecutar la consulta
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        // Obtener el resultado de la consulta
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si el resultado existe, devolver las estadísticas
        if ($resultado) {
            return [
                'totalJornadas' => $resultado['totalJornadas'] ?? 0,
                'totalGenerales' => $resultado['totalGenerales'] ?? 0,
                'totalActualizaciones' => $resultado['totalActualizaciones'] ?? 0
            ];
        }

        return null;
    }

    // Función para obtener las estadísticas por usuario (sin ausencias)
    private function obtenerEstadisticasPorUsuario($num_doc) {
        $sql = "
            SELECT 
                SUM(CASE WHEN tipo = 'Jornada' THEN 1 ELSE 0 END) AS totalJornadas,
                SUM(CASE WHEN tipo = 'General' THEN 1 ELSE 0 END) AS totalGenerales,
                SUM(CASE WHEN tipo = 'Rechazo' OR tipo = 'Aceptacion' THEN 1 ELSE 0 END) AS totalActualizaciones
            FROM notificacion
            WHERE num_doc = :num_doc;
        ";

        // Preparar la consulta y asociar el parámetro num_doc
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
        $stmt->execute();

        // Obtener el resultado de la consulta
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si el resultado existe, devolver las estadísticas
        if ($resultado) {
            return [
                'totalJornadas' => $resultado['totalJornadas'] ?? 0,
                'totalGenerales' => $resultado['totalGenerales'] ?? 0,
                'totalActualizaciones' => $resultado['totalActualizaciones'] ?? 0
            ];
        }

        return null;
    }


    public function obtenerEstudio($idhojadevida) {
        $sql = "
        SELECT * FROM estudio WHERE hojadevida_idhojadevida = :idhojadevida";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idhojadevida', $idhojadevida, PDO::PARAM_INT);
        $stmt->execute();
    
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if ($resultado) {
            return $resultado;
        } else {
            return false;
        }
    }

    public function obtenerExperiencia($idhojadevida){
        $sql = "SELECT * FROM experiencialaboral WHERE hojadevida_idhojadevida = :idhojadevida";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idhojadevida', $idhojadevida, PDO::PARAM_INT);
        $stmt->execute();
    
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if ($resultado) {
            return $resultado;
        } else {
            return false;
        }
    }

    public function eliminarEstudio($idestudio) {
        $sql = "DELETE FROM estudio WHERE idestudio = :idestudio";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idestudio', $idestudio, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function eliminarExperiencia($idexperiencialaboral) {
        $sql = "DELETE FROM experienciaLaboral WHERE idexperienciaLaboral = :idexperienciaLaboral";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':idexperienciaLaboral', $idexperiencia, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
?>