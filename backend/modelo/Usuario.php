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
  


   


    
   
   
    
  
    //Esto es chat
    public function obtenerRRHH() {
    $sql = "SELECT * FROM usuario AS u
            INNER JOIN rol AS r ON u.rol_idrol = r.idrol
            WHERE r.nombreRol = 'Recursos humanos' OR r.nombreRol = 'Administrador'";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();

    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $resultado ?: [];
}


  

 

    
}
?>