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

    public function obtenerHojadevida(int $hojadevida_idHojadevida): ?array {
        $sql = "SELECT * FROM hojadevida WHERE idHojadevida = ?";
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([$hojadevida_idHojadevida]);
        
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            return null;
        }
    }
    
    public function actualizacionHojadeVida($hojadevida_idHojadevida,$data) {
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