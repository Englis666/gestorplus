<?php
namespace Modelo;

use PDO;
use PDOException;
use Config\Database;

class Auth {
    private $db;
    
    public function __construct($db){
        $this->db = $db;
    }

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
                $horaEntrada = date('H:i:s'); 
                $estadoJornada = "Pendiente";
    
                $entrada = new DateTime($horaEntrada);
                $entrada->modify('+8 hours');
                $horaSalida = $entrada->format('H:i:s');
            
                $verificar = $this->db->prepare("SELECT * FROM jornada WHERE usuario_num_doc = ? AND fecha = ? AND horaSalida IS NULL");
                $verificar->execute([$num_doc, $fecha]);
                
                if ($verificar->rowCount() === 0) {
                    $insertarMiJornada = $this->db->prepare("INSERT INTO jornada (fecha, horaEntrada, usuario_num_doc, estadoJornada) 
                                                             VALUES (?, ?, ?, ?)");
                    if ($insertarMiJornada->execute([$fecha, $horaEntrada, $num_doc, $estadoJornada])) {
                        $descripcion = "Nueva jornada registrada por inicio de sesión para el usuario con documento: $num_doc y con el nombre $nombres";
                        
                        $insertarNotificacion = $this->db->prepare("INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                                                     VALUES (?, ?, ?, ?)");
                        $insertarNotificacion->execute([$descripcion, 'Jornada Registrada', 'Jornada', $num_doc]);
                    }
                }
    
                return [
                    'num_doc' => $usuario['num_doc'],
                    'nombres' => $usuario['nombres'],
                    'rol' => $usuario['rol_idrol'],
                    'hojadevida_idHojadevida' => $usuario['hojadevida_idHojadevida']
                ];
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
    


}