<?php
namespace Modelo;

use Config\Database;

use PDO;
use PDOException;

class Chat {
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    // Iniciar o buscar un chat
    public function iniciarChat($targetNum_doc, $num_doc) {
        $sql = "SELECT idChat FROM chats WHERE 
                   (num_doc_emisor = :num_doc AND num_doc_receptor = :targetNum_doc)
                OR (num_doc_emisor = :targetNum_doc AND num_doc_receptor = :num_doc) 
                LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);
        $stmt->bindParam(':targetNum_doc', $targetNum_doc, PDO::PARAM_INT);
        $stmt->execute();
    
        $chatExistente = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($chatExistente) {
            return $chatExistente['idChat'];
        }
    
        $sql = "INSERT INTO chats (num_doc_emisor, num_doc_receptor) 
                VALUES (:num_doc, :targetNum_doc)";
        $stmt = $this->db->prepare($sql);  
        $stmt->bindParam(':num_doc', $num_doc, PDO::PARAM_INT);  
        $stmt->bindParam(':targetNum_doc', $targetNum_doc, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        } else {
            return false;
        }
    }

    // Enviar mensaje
    public function enviarMensajes($message, $num_doc, $idChat) {
        if (!$idChat) {
            return [
                'status' => 'error',
                'message' => 'No se encontró un chat válido.'
            ];
        }

        $sql = "INSERT INTO messages (message, num_doc_emisor, idChat) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($sql);

        if ($stmt->execute([$message, $num_doc, $idChat])) {
            return ['status' => 'success'];
        } else {
            return ['status' => 'error', 'message' => 'No se pudo enviar el mensaje.'];
        }
    }

    // Obtener el último chat del usuario
    public function obtenerOcrearChat($num_doc_emisor, $num_doc_receptor) {
    // Verificar si ya existe un chat entre estos usuarios
    $stmt = $this->db->prepare("
        SELECT idChat FROM chats 
        WHERE (num_doc_emisor = :num_doc_emisor AND num_doc_receptor = :num_doc_receptor) 
        OR (num_doc_emisor = :num_doc_receptor AND num_doc_receptor = :num_doc_emisor)
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->bindParam(':num_doc_emisor', $num_doc_emisor, PDO::PARAM_INT);
    $stmt->bindParam(':num_doc_receptor', $num_doc_receptor, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Si el chat existe, devolver idChat
    if ($result) {
        return $result['idChat'];
    }

    // Si no existe, crear un nuevo chat
    $stmt = $this->db->prepare("
        INSERT INTO chats (num_doc_emisor, num_doc_receptor, created_at) 
        VALUES (:num_doc_emisor, :num_doc_receptor, NOW())
    ");
    $stmt->bindParam(':num_doc_emisor', $num_doc_emisor, PDO::PARAM_INT);
    $stmt->bindParam(':num_doc_receptor', $num_doc_receptor, PDO::PARAM_INT);

    if ($stmt->execute()) {
        return $this->db->lastInsertId(); // Devuelve el ID del nuevo chat creado
    }

    return null; // Si no se pudo crear el chat
}


    // Obtener los mensajes de un chat
    public function obtenerMensajes($idChat) {
        $consulta = "SELECT m.*, u.num_doc AS emisor FROM messages AS m
                     INNER JOIN usuario AS u ON m.num_doc_emisor = u.num_doc
                     WHERE m.idChat = :idChat ORDER BY m.created_at ASC";
        $stmt = $this->db->prepare($consulta);
        $stmt->bindParam(':idChat', $idChat, PDO::PARAM_INT);
        $stmt->execute();
    
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
