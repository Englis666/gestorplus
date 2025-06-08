<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Model;

use Service\DatabaseService;
use PDOException;

class Chat {
    private DatabaseService $dbService;

    public function __construct(DatabaseService $dbService) {
        $this->dbService = $dbService;
    }
    public function enviarMensaje($idChat, $num_doc_emisor, $mensaje) {
        try {
            $query = "INSERT INTO mensajes (usuario_num_doc, fecha_envio, mensaje, idChat) 
                    VALUES (:num_doc_emisor, NOW(), :mensaje, :idChat)";

            $params = [
                ':idChat' => $idChat,
                ':num_doc_emisor' => $num_doc_emisor,
                ':mensaje' => $mensaje
            ];

            $result = $this->dbService->ejecutarConsulta($query, $params);
            // Si no hubo excepción, consideramos éxito
            return $result !== false;
        } catch (PDOException $e) {
            error_log("Excepción PDO: " . $e->getMessage());
            return false;
        }
    }

    public function obtenerOcrearChat($num_doc_emisor, $num_doc_receptor) {
        try {
            $query = "
                SELECT idChat 
                FROM chat 
                WHERE (usuario1 = :num_doc_emisor AND usuario2 = :num_doc_receptor) 
                OR (usuario1 = :num_doc_receptor AND usuario2 = :num_doc_emisor)
                ORDER BY created_at DESC 
                LIMIT 1
            ";

            $params = [
                ':num_doc_emisor' => $num_doc_emisor,
                ':num_doc_receptor' => $num_doc_receptor
            ];

            $result = $this->dbService->ejecutarConsulta($query, $params);

            if ($result) {
                return $result[0]['idChat'];
            }

            $query = "
                INSERT INTO chat (usuario1, usuario2, created_at) 
                VALUES (:num_doc_emisor, :num_doc_receptor, NOW())
            ";

            return $this->dbService->ejecutarConsulta($query, $params, true);

        } catch (PDOException $e) {
            error_log("Error al obtener o crear el chat: " . $e->getMessage());
            return null;
        }
    }

    public function obtenerMensajes($idChat) {
        try {
            $query = "
                SELECT m.*, u.nombres, u.apellidos 
                FROM mensajes m
                JOIN usuario u ON m.usuario_num_doc = u.num_doc
                WHERE m.idChat = :idChat
                ORDER BY m.fecha_envio ASC
            ";

            $params = [':idChat' => $idChat];

            return $this->dbService->ejecutarConsulta($query, $params);
        } catch (PDOException $e) {
            error_log("Error al obtener mensajes: " . $e->getMessage());
            return false;
        }
    }
}
?>
