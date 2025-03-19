<?php
namespace Controlador;

use Config\DataBase;
use Config\Clave;
use Modelo\Aspirante;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AspiranteControlador {
    private $db;
    private $aspirante;

    public function __construct() {
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->aspirante = new Aspirante($this->db);
    }

    private function obtenerNumDocDesdeToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Token no proporcionado o formato incorrecto']);
            exit;
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
            return $decoded->data->num_doc ?? null;
        } catch (\Firebase\JWT\ExpiredException $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Token expirado']);
            exit;
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            http_response_code(403);
            echo json_encode(['error' => 'Token con firma inválida']);
            exit;
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
            exit;
        }
    }

    public function verificarPostulacion() {
        $num_doc = $this->obtenerNumDocDesdeToken();
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;

        if (!$num_doc || !$idconvocatoria) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos insuficientes']);
            return;
        }

        $resultados = $this->aspirante->verificarPostulacion($num_doc, $idconvocatoria);
        http_response_code(200);
        echo json_encode(['PostulacionVerificada' => $resultados ?? null]);
    }

    public function obtenerNotificaciones() {
        $num_doc = $this->obtenerNumDocDesdeToken();

        if (!$num_doc) {
            http_response_code(400);
            echo json_encode(['error' => 'No se encontró el número de documento en el token']);
            return;
        }

        $resultados = $this->aspirante->obtenerNotificaciones($num_doc);
        http_response_code(200);
        echo json_encode(['notificaciones' => $resultados ?? []]);
    }
    public function aplicacionDeAspirante($data) {
        $num_doc = $this->obtenerNumDocDesdeToken();

        if (!$num_doc || !isset($data['idconvocatoria'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos insuficientes']);
            return;
        }

        $idconvocatoria = $data['idconvocatoria'];
        $resultado = $this->aspirante->aplicacionDeAspirante($num_doc, $idconvocatoria);

        if ($resultado) {
            http_response_code(200);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo completar la aplicación']);
        }
    }
}
?>
