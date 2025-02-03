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

    public function obtenerMensajes($num_doc, $targetNum_doc) {
        $mensajes = [];
            $consulta = "SELECT * FROM chat as c
                         INNER JOIN quejareclamo as q ON c.idChat = q.chat_idChat
                         WHERE c.emisor = :num_doc AND c.receptor = :target_num_doc";
            $stmt = $this->db->prepare($consulta);
            $stmt->bindParam(':num_doc', $num_doc);
            $stmt->bindParam(':target_num_doc', $targetNum_doc);
            $stmt->execute();
            
            $mensajes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            if($mensajes){
                return $mensajes;
            }
            return [];
    }
    
    public function obtenerMensajesDelUsuario($num_doc, $targetNum_doc) {
        $mensajes = [];
            $consulta = "SELECT * FROM chat as c
                         INNER JOIN quejareclamo as q ON c.idChat = q.chat_idChat
                         WHERE q.usuario_emisor = :num_doc AND q.usuario_receptor = :target_num_doc";
            $stmt = $this->db->prepare($consulta);
            $stmt->bindParam(':num_doc', $num_doc);
            $stmt->bindParam(':target_num_doc', $targetNum_doc);
            $stmt->execute();
            
            $mensajes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            if($mensajes){
                return $mensajes;
            }
            return [];
    }

}
?>
