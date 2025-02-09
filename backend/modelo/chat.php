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
    

    public function enviarMensajes($message, $num_doc,$targetNum_doc){

        $idChat = $this->iniciarChat($targetNum_doc, $num_doc);

        if (!$idChat) {
            echo json_encode([
                'status' => 'error',
                'message' => 'No se encontró un chat para el emisor.'
            ]);
            return;
        }

        $sql = "INSERT INTO quejareclamo (mensaje_emisor, usuario_emisor,usuario_receptor,chat_idChat) VALUES (?, ?, ? , ?)";
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$message, $num_doc,$targetNum_doc,$idChat]);
    }

    public function obtenerIdChat($data){
            $stmt = $this->pdo->prepare("SELECT idChat FROM chat WHERE receptor = :num_doc");
            $stmt->bindParam(':num_doc', $num_doc);
            $stmt->execute();
      
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
      
            return $result ? $result['idChat'] : null;

        
    }

    public function obtenerMensajes($idChat) {
        $consulta = "SELECT * FROM chat AS c
                     INNER JOIN quejareclamo AS q ON c.idChat = q.chat_idChat
                     WHERE c.idChat = :idChat";
        $stmt = $this->db->prepare($consulta);
        $stmt->bindParam(':idChat', $idChat, PDO::PARAM_INT);
        $stmt->execute();
    
        $mensajes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $mensajes ? $mensajes : [];
    }
    

}
?>
