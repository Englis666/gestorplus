<?php
// MODELO
require_once 'config/config.php';

class Chat {

    private $db;

    public function __construct($db){
        $this->db = $db;
    }


    public function iniciarChat($targetNum_doc, $num_doc) {
        $sql = "SELECT idChat FROM chat WHERE (emisor = :num_doc AND receptor = :targetNum_doc)
                                                  OR (emisor = :targetNum_doc AND receptor = :num_doc) LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
        $stmt->bindParam(':targetNum_doc', $targetNum_doc, PDO::PARAM_INT);
        $stmt->execute();
    
        $chatExistente = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($chatExistente) {
            return $chatExistente['idChat'];
        }
    
        $sql = "INSERT INTO chat (emisor, receptor) VALUES (:num_doc, :targetNum_doc)";
        $stmt = $this->db->prepare($sql);  
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);  
        $stmt->bindParam(':targetNum_doc', $targetNum_doc, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        } else {
            return false;
        }
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
