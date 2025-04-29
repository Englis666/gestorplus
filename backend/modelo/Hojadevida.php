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

    public function obtenerHojadevidaPorNumDoc(int $num_doc): ?array {
        if ($num_doc <= 0) {
            throw new Exception('El número de documento no es válido', 400);
        }
    
        try {
            // Obtener el ID de la hoja de vida
            $sql = "SELECT hojadevida_idHojadevida FROM usuario WHERE num_doc = :num_doc";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
            $stmt->execute();
        
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if (!$result || !isset($result['hojadevida_idHojadevida'])) {
                return null; // Si no se encuentra la hoja de vida asociada al usuario
            }
    
            // Obtener los detalles de la hoja de vida
            $idHojadevida = $result['hojadevida_idHojadevida'];
    
            $sql = "SELECT h.*, e.*, exp.*, u.*
                    FROM hojadevida h
                    LEFT JOIN estudio e ON h.idHojadevida = e.hojadevida_idHojadevida
                    LEFT JOIN experiencialaboral exp ON h.idHojadevida = exp.hojadevida_idHojadevida
                    INNER JOIN usuario u ON h.idHojadevida = u.hojadevida_idHojadevida
                    WHERE h.idHojadevida = :idHojadevida";
        
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':idHojadevida', $idHojadevida, PDO::PARAM_INT);
            $stmt->execute();
        
            $datos = $stmt->fetch(PDO::FETCH_ASSOC);
        
            return $datos ?: null; // Devuelve null si no hay resultados
        } catch (PDOException $e) {
            // Manejo de errores de la base de datos
            throw new Exception('Error al obtener los datos de la hoja de vida: ' . $e->getMessage(), 500);
        }
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
                    estadohojadevida = ?,
                    estadoCivil = ?,
                    genero = ?,
                    habilidades = ?,
                    portafolio = ?
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
            $data['estadoCivil'],
            $data['genero'],
            $data['habilidades'],
            $data['portafolio'],
            $hojadevida_idHojadevida
        ]);
    
        return json_encode(['message' => 'Hoja de vida actualizada']);
    }


}