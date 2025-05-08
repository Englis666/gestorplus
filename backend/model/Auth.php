<?php
namespace Model;

use Service\DatabaseService;
use PDOException;

class Auth {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService){
        $this->dbService = $dbService;
    }

    public function registrar($data) {
        try {
            $this->dbService->iniciarTransaccion();

            $sqlHojaDeVida = "INSERT INTO hojadevida () VALUES ()"; 
            $idHojadevida = $this->dbService->ejecutarInsert($sqlHojaDeVida);

            if (!$idHojadevida) {
                $this->dbService->revertirTransaccion();
                return json_encode(['message' => 'No se pudo registrar la hoja de vida.']);
            }

            $sqlUsuario = "INSERT INTO usuario (num_doc, nombres, apellidos, email, tipodDoc, password, estado, rol_idrol, hojadevida_idHojadevida) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $usuarioInsertado = $this->dbService->ejecutarAccion($sqlUsuario, [
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

            if (!$usuarioInsertado) {
                $this->dbService->revertirTransaccion();
                return json_encode(['message' => 'Error al registrar el usuario.']);
            }

            $this->dbService->confirmarTransaccion();
            return json_encode(['message' => 'Usuario registrado correctamente']);

        } catch (PDOException $e) {
            $this->dbService->revertirTransaccion();
            return json_encode(['message' => 'Error al registrar: ' . $e->getMessage()]);
        }
    }

    public function inicioSesion($data){
        date_default_timezone_set('America/Bogota');

        $sql = "SELECT * FROM usuario WHERE num_doc = ?";
        $usuario = $this->dbService->ejecutarConsulta($sql, [$data['num_doc']], true);

        if ($usuario && password_verify($data['password'], $usuario['password'])) {

            if ($usuario['rol_idrol'] != 4) {
                $num_doc = $usuario['num_doc'];
                $nombres = $usuario['nombres'];
                $fecha = date('Y-m-d'); 
                $horaEntrada = date('H:i:s'); 
                $estadoJornada = "Pendiente";

                $entrada = new \DateTime("$fecha $horaEntrada");
                $entrada->modify('+8 hours');
                $horaSalida = $entrada->format('H:i:s');

                $sqlVerificar = "SELECT * FROM jornada WHERE usuario_num_doc = ? AND fecha = ? AND horaSalida IS NULL";
                $jornadaExistente = $this->dbService->ejecutarConsulta($sqlVerificar, [$num_doc, $fecha]);

                if (empty($jornadaExistente)) {
                    $sqlInsertarJornada = "INSERT INTO jornada (fecha, horaEntrada, usuario_num_doc, estadoJornada) 
                                           VALUES (?, ?, ?, ?)";
                    $this->dbService->ejecutarAccion($sqlInsertarJornada, [$fecha, $horaEntrada, $num_doc, $estadoJornada]);

                    $descripcion = "Nueva jornada registrada por inicio de sesión para el usuario con documento: $num_doc y con el nombre $nombres";

                    $sqlInsertarNotificacion = "INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc) 
                                                VALUES (?, ?, ?, ?)";
                    $this->dbService->ejecutarAccion($sqlInsertarNotificacion, [$descripcion, 'Jornada Registrada', 'Jornada', $num_doc]);
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
