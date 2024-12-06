<?php
// MODELOS
require_once 'modelo/chat.php';
require_once 'config/config.php';

class ChatControlador {

    private $db;
    private $chat;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->chat = new Chat($this->db);
    }

    public function insertarMensajes($data){
        $mensajes = $data['mensajes'];
        $idEntrante = $data['idEntrante'];

        $resultado = $this->chat->insertarMensajes($mensajes, $idEntrante);

        if ($resultado) {
            echo json_encode(['status' => 'success', 'message' => 'Mensaje enviado correctamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al enviar el mensaje']);
        }
    }

    public function obtenerMensajes($data){
        $idEntrante = $data['idEntrante'];

        $mensajes = $this->chat->obtenerMensajes($idEntrante);

        echo json_encode(['status' => 'success', 'mensajes' => $mensajes]);
    }
}
?>
