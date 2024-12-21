<?php
// MODELO
require_once 'config/config.php';

class Chat {

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function insertarMensajes($mensajes, $idEntrante){
        $sql = "INSERT INTO chat (mensajes, idEntrante) VALUES (?, ?)";
        
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$mensajes, $idEntrante]);
    }

    public function obtenerMensajes($idEntrante){
        $sql = "SELECT * FROM chat WHERE idEntrante = ? ORDER BY created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([$idEntrante]);

        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $resultado;
    }
}
?>
