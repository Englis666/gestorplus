<?php
// MODELOS
require_once 'modelo/aspirante.php';
require_once 'config/config.php';

// JWT
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AspiranteControlador {

    private $db;
    private $aspirante;

    public function __construct() {
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->aspirante = new Aspirante($this->db);
    }

    /**
     * Extrae y verifica el token JWT del encabezado de la solicitud.
     */
    private function obtenerNumDocDesdeToken() {
        $authHeader = apache_request_headers()['Authorization'] ?? null;

        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(['error' => 'Token no proporcionado']);
            exit;
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = JWT::decode($token, new Key(SECRET_KEY, JWT_ALGO));
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

    public function verificarPostulacion () {
        $num_doc = $this->obtenerNumDocDesdeToken();
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;

        if(!$num_doc) {
            http_response_code(400);
            echo json_encode(['error' => 'No se encontró el número de documento en el token']);
            return;
        }

        $resultados = $this->aspirante->verificarPostulacion($num_doc, $idconvocatoria);

        http_response_code(200);
        echo json_encode(['PostulacionVerificada' => $resultados ?? null]);
    }

    public function obtenerPostulacionesAspirante() {
        $num_doc = $this->obtenerNumDocDesdeToken();

        if (!$num_doc) {
            http_response_code(400);
            echo json_encode(['error' => 'No se encontró el número de documento en el token']);
            return;
        }

        $resultados = $this->aspirante->obtenerPostulacionesAspirante($num_doc);

        http_response_code(200);
        echo json_encode(['MisPostulaciones' => $resultados ?? []]);
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

    public function obtenerDetalleConvocatoria() {
        if (!isset($_GET['idconvocatoria'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No se recibió el ID de la convocatoria']);
            return;
        }

        $idconvocatoria = $_GET['idconvocatoria'];
        $resultados = $this->aspirante->obtenerDetalleConvocatoria($idconvocatoria);

        http_response_code(200);
        echo json_encode(['DetalleConvocatoria' => $resultados ?? null]);
    }

    public function aplicacionDeAspirante($data) {
        $num_doc = $this->obtenerNumDocDesdeToken();

        if (!$num_doc) {
            http_response_code(400);
            echo json_encode(['error' => 'No se encontró el número de documento en el token']);
            return;
        }

        if (!isset($data['idconvocatoria'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No se recibió el ID de la convocatoria']);
            return;
        }

        $idconvocatoria = $data['idconvocatoria'];
        $resultado = $this->aspirante->aplicacionDeAspirante($num_doc, $idconvocatoria);

        if ($resultado) {
            http_response_code(200);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudo completar la aplicación']);
        }
    }
}
?>
