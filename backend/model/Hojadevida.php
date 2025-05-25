<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Model;

use Service\DatabaseService;
use Exception;

class Hojadevida {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerHojadevidaPorNumDoc(int $num_doc): ?array {
        if ($num_doc <= 0) {
            throw new Exception('El número de documento no es válido', 400);
        }

        $sqlUsuario = "SELECT hojadevida_idHojadevida FROM usuario WHERE num_doc = :num_doc";
        $usuario = $this->dbService->ejecutarConsulta($sqlUsuario, ['num_doc' => $num_doc], true);

        if (!$usuario || !isset($usuario['hojadevida_idHojadevida'])) {
            return null;
        }

        $idHojadevida = (int) $usuario['hojadevida_idHojadevida'];

        $sqlDetalles = "
            SELECT h.*, e.*, exp.*, u.*
            FROM hojadevida h
            LEFT JOIN estudio e ON h.idHojadevida = e.hojadevida_idHojadevida
            LEFT JOIN experiencialaboral exp ON h.idHojadevida = exp.hojadevida_idHojadevida
            INNER JOIN usuario u ON h.idHojadevida = u.hojadevida_idHojadevida
            WHERE h.idHojadevida = :idHojadevida
        ";

        return $this->dbService->ejecutarConsulta($sqlDetalles, ['idHojadevida' => $idHojadevida], true);
    }

    public function obtenerHojadevida(int $hojadevida_idHojadevida): ?array {
        $sql = "SELECT * FROM hojadevida WHERE idHojadevida = :id";
        return $this->dbService->ejecutarConsulta($sql, ['id' => $hojadevida_idHojadevida], true);
    }

    public function actualizacionHojadeVida(int $hojadevida_idHojadevida, array $data): array {
        $sql = "
            UPDATE hojadevida SET 
                fechaNacimiento = :fechaNacimiento,
                direccion = :direccion,
                ciudad = :ciudad,
                ciudadNacimiento = :ciudadNacimiento,
                telefono = :telefono,
                telefonoFijo = :telefonoFijo,
                estadohojadevida = :estadohojadevida,
                estadoCivil = :estadoCivil,
                genero = :genero,
                habilidades = :habilidades,
                portafolio = :portafolio
            WHERE idHojadevida = :idHojadevida
        ";

        $params = [
            'fechaNacimiento' => $data['fechaNacimiento'],
            'direccion'       => $data['direccion'],
            'ciudad'          => $data['ciudad'],
            'ciudadNacimiento'=> $data['ciudadNacimiento'],
            'telefono'        => $data['telefono'],
            'telefonoFijo'    => $data['telefonoFijo'],
            'estadohojadevida'=> 'Activa',
            'estadoCivil'     => $data['estadoCivil'],
            'genero'          => $data['genero'],
            'habilidades'     => $data['habilidades'],
            'portafolio'      => $data['portafolio'],
            'idHojadevida'    => $hojadevida_idHojadevida
        ];

        $success = $this->dbService->ejecutarUpdate($sql, $params);

        return ['message' => $success ? 'Hoja de vida actualizada' : 'No se actualizó la hoja de vida'];
    }
}
