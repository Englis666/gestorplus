<?php
namespace Modelo;
use Config\Database;
use PDO;
use PDOException;

class Hojadevida{
    private $db;

    public function __construct($db){
        $this->db = $db;
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


}