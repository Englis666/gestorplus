<?php
namespace Migrations;

include_once '../vendor/autoload.php';

use PDO;
use PhpOffice\PhpSpreadsheet\IOFactory;

class MigrarExcel {
    private PDO $db;

    public function __construct() {
        $this->db = (new \Config\Database())->getConnection();
    }

    public function importarExcel($filename) {
        try {
            echo "Cargando archivo: $filename\n"; ?> <br> <?php
            $spreadsheet = IOFactory::load($filename);
            $hojas = $spreadsheet->getAllSheets();

            foreach ($hojas as $hoja) {
                $nombreHoja = $hoja->getTitle();
                echo "Procesando hoja: $nombreHoja\n"; ?> <br> <?php

                $rows = $hoja->toArray();

                foreach ($rows as $index => $row) {
                    if ($index === 0) continue; // Encabezado

                    switch (strtolower($nombreHoja)) {
                        case 'rol':
                            $this->importarRoles($row);
                            break;
                        case 'hojadevida':
                            $this->importarHojadevida($row);
                            break;
                        case 'usuario':
                            $this->importarUsuario($row);
                            break;
                        default:
                            echo "Hoja desconocida: $nombreHoja\n";
                            break;
                    }
                }
            }

            echo "Migración completada.\n"; ?> <br> <?php
        } catch (\Exception $e) {
            echo "Error al importar archivo: " . $e->getMessage() . "\n";
        }
    }

    public function importarRoles($row) {
        try {
            [$idrol, $nombreRol, $estadoRol] = $row;

            $stmt = $this->db->prepare("INSERT INTO rol (idrol, nombreRol, estadoRol) VALUES (?, ?, ?)");
            $stmt->execute([$idrol, $nombreRol, $estadoRol]);

            echo "Rol insertado: $nombreRol\n";
        } catch (\Exception $e) {
            echo "Error al insertar rol: " . $e->getMessage() . "\n";
        }
    }

    public function importarHojadevida($row) {
        try {
            [$idhojadevida, $fechaNacimiento, $direccion, $ciudad, $ciudadNacimiento, $telefono,
             $telefonoFijo, $estado, $estadoCivil, $genero, $habilidades, $portafolio] = $row;

            $stmt = $this->db->prepare("INSERT INTO hojadevida 
                (idHojadevida, fechaNacimiento, direccion, ciudad, ciudadNacimiento, telefono, telefonoFijo, estadohojadevida, estadoCivil, genero, habilidades, portafolio) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $idhojadevida, $fechaNacimiento, $direccion, $ciudad, $ciudadNacimiento, $telefono,
                $telefonoFijo, $estado, $estadoCivil, $genero, $habilidades, $portafolio
            ]);

            echo "Hoja de vida insertada: ID $idhojadevida\n";
        } catch (\Exception $e) {
            echo "Error al insertar hoja de vida: " . $e->getMessage() . "\n";
        }
    }

    public function importarUsuario($row) {
        try {
            [$num_doc, $nombres, $apellidos, $email, $tipodDoc, $password, $estado, $idhojadevida, $idrol] = $row;

            $stmt = $this->db->prepare("INSERT INTO usuario 
                (num_doc, nombres, apellidos, email, tipodDoc, password, estado, hojadevida_idHojadevida, rol_idrol) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $num_doc, $nombres, $apellidos, $email, $tipodDoc, $password, $estado, $idhojadevida, $idrol
            ]);

            echo "Usuario insertado: $nombres $apellidos\n";
        } catch (\Exception $e) {
            echo "Error al insertar usuario: " . $e->getMessage() . "\n";
        }
    }
}
