<?php
namespace Migrations;

use PDO;
class HojadevidaMigration {
    private PDO $db;
    public function __construct() {
        $this->db = (new \Config\Database())->getConnection();
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
}