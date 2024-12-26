<?php
// MODELO
require_once 'config/config.php';

class Chat {

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function enviarMensajes($message, $num_doc){
        $sql = "INSERT INTO quejareclamo (mensajes, usuario_num_doc) VALUES (?, ?)";
        
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$message, $num_doc]);
    }

    public function obtenerMensajes($num_doc){
        $sql = "SELECT * FROM quejareclamo WHERE usuario_num_doc = ? ORDER BY created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->execute([$num_doc]);

        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $resultado;
    }
}
?>
