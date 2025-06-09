<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types = 1);

namespace Model;

use Service\DatabaseService;
use Exception;

class Postulacion {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }

    public function obtenerPostulacionesAspirante(int $num_doc): ?array {
        try {
            $sql = "
                SELECT * FROM postulacion p 
                INNER JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idCargo = ca.idCargo
                WHERE p.usuario_num_doc = :num_doc
            ";
            $params = [':num_doc' => $num_doc];
            return $this->dbService->ejecutarConsulta($sql, $params) ?? null;
        } catch (Exception $e) {
            error_log("Error al obtener postulaciones del aspirante: " . $e->getMessage());
            return null;
        }
    }

    public function obtenerPostulaciones(): array {
        try {
            $sql = "
                SELECT * FROM postulacion as p
                INNER JOIN usuario as u ON p.usuario_num_doc = u.num_doc
                INNER JOIN convocatoria as c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo as ca ON c.cargo_idcargo = ca.idcargo
            ";
            return $this->dbService->ejecutarConsulta($sql) ?? [];
        } catch (Exception $e) {
            error_log("Error al obtener todas las postulaciones: " . $e->getMessage());
            return [];
        }
    }

    public function verificarPostulacion(int $num_doc, int $idconvocatoria): ?array {
        try {
            $sqlHoja = "SELECT h.fechaNacimiento, h.direccion, h.ciudad, h.ciudadNacimiento, h.telefono, h.estadohojadevida, h.estadoCivil, h.genero, h.habilidades, h.portafolio
                        FROM usuario u
                        INNER JOIN hojadevida h ON u.hojadevida_idHojadevida = h.idHojadevida
                        WHERE u.num_doc = :num_doc";
            $params = [':num_doc' => $num_doc];
            $hoja = $this->dbService->ejecutarConsulta($sqlHoja, $params, true);

            if (!$hoja) {
                return ['tieneHojaDeVida' => false];
            }

            $camposImportantes = [
                'fechaNacimiento', 'direccion', 'ciudad', 'ciudadNacimiento', 'telefono',
                'estadoCivil', 'genero', 'habilidades', 'portafolio'
            ];
            $tieneDatos = false;
            foreach ($camposImportantes as $campo) {
                if (!empty($hoja[$campo])) {
                    $tieneDatos = true;
                    break;
                }
            }
            if (!$tieneDatos) {
                return ['tieneHojaDeVida' => false];
            }


            $sqlId = "SELECT h.idHojadevida FROM usuario u INNER JOIN hojadevida h ON u.hojadevida_idHojadevida = h.idHojadevida WHERE u.num_doc = :num_doc";
            $idRow = $this->dbService->ejecutarConsulta($sqlId, [':num_doc' => $num_doc], true);
            $idHojadevida = $idRow['idHojadevida'] ?? null;



            $sqlPostulacion = "SELECT idpostulacion FROM postulacion WHERE usuario_num_doc = :num_doc AND convocatoria_idconvocatoria = :idconvocatoria LIMIT 1";
            $yaAplicadoRow = $this->dbService->ejecutarConsulta($sqlPostulacion, [
                ':num_doc' => $num_doc,
                ':idconvocatoria' => $idconvocatoria
            ], true);
            $yaAplicado = !empty($yaAplicadoRow);

            $sqlEstudio = "SELECT idestudio FROM estudio WHERE hojadevida_idHojadevida = :idHojadevida LIMIT 1";
            $estudio = $this->dbService->ejecutarConsulta($sqlEstudio, [':idHojadevida' => $idHojadevida], true);

            $sqlExp = "SELECT idexperienciaLaboral FROM experiencialaboral WHERE hojadevida_idHojadevida = :idHojadevida LIMIT 1";
            $exp = $this->dbService->ejecutarConsulta($sqlExp, [':idHojadevida' => $idHojadevida], true);

            return [
                'tieneHojaDeVida' => true,
                'yaAplicado' => $yaAplicado, // <--- ESTA BANDERA ES CLAVE
                'tieneEstudio' => !empty($estudio['idestudio']),
                'tieneExperiencia' => !empty($exp['idexperienciaLaboral'])
            ];
        } catch (Exception $e) {
            error_log("Error al verificar postulaciones: " . $e->getMessage());
            return null;
        }
    }

    public function obtenerPostulacionesAgrupadasPorConvocatoria(int $idconvocatoria): array {
        try {
            $sql = "
                SELECT 
                    u.num_doc,
                    u.nombres,
                    u.email,
                    p.idpostulacion,
                    ca.nombreCargo AS cargo,
                    h.*
                FROM postulacion p
                INNER JOIN usuario u ON p.usuario_num_doc = u.num_doc
                INNER JOIN hojadevida h ON u.hojadevida_idHojadevida = h.idHojadevida
                INNER JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria
                INNER JOIN cargo ca ON c.cargo_idcargo = ca.idcargo
                WHERE c.idconvocatoria = :idconvocatoria
            ";
            $params = [':idconvocatoria' => $idconvocatoria];
            return $this->dbService->ejecutarConsulta($sql, $params) ?? [];
        } catch (Exception $e) {
            error_log("Error al obtener postulaciones agrupadas: " . $e->getMessage());
            return [];
        }
    }
}
