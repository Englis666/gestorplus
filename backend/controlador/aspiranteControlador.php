<?php
// MODELOS
require_once 'modelo/aspirante.php';
require_once 'config/config.php';
//JWT
require_once 'config/clave.php';
require_once 'vendor/autoload.php';  
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AspiranteControlador {

    private $db;
    private $aspirante;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->aspirante = new Aspirante($this->db);
    }

    public function obtenerNotificaciones(){
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;

            if(!$num_doc){
                echo json_encode(['error' => 'No se encontro el numero de documento en el token']);
                http_response_code(400);
                return;
            }

            $this->aspirante = new Aspirante($this->db);
            $resultados = $this->aspirante->obtenerNotificaciones($num_doc);

            if($resultados){
                echo json_encode(['Notificaciones' => $resultados]);
            } else{
                echo json_encode(['Notificaciones' =>[]]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        } 

    }

    public function obtenerDetalleConvocatoria(){

        if (isset($_GET['idconvocatoria'])){
            $idconvocatoria = $_GET['idconvocatoria'];
        } else{
            echo json_encode(['error' => 'No se recibió el id de la convocatoria']);
            http_response_code(400);
            return;
        }

        $this->aspirante = new Aspirante($this->db);
        $resultados = $this->aspirante->obtenerDetalleConvocatoria($idconvocatoria);

        if($resultados){
            echo json_encode(['DetalleConvocatoria' => $resultados]);
        } else{
            echo json_encode(['DetalleConvocatoria' =>null]);
        }

    }

    public function aplicacionDeAspirante(){
        
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader){
            echo json_encode(['error' => 'Token no proporcionado']);
            http_response_code(401);
            return;
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $secretKey = SECRET_KEY;
            $decoded = JWT::decode($token, new Key($secretKey, JWT_ALGO));
            $num_doc = $decoded->data->num_doc;

            if(!$num_doc){
                echo json_encode(['error' => 'No se encontro el numero de documento en el token']);
                http_response_code(400);
                return;
            }

            if(isset($_POST['idconvocatoria'])){
                $idconvocatoria = $_POST['idconvocatoria'];
            } else{
                echo json_encode(['error' => 'No se recibió el id de la convocatoria']);
                http_response_code(400);
                return;
            }

            $this->aspirante = new Aspirante($this->db);
            $resultados = $this->aspirante->aplicacionDeAspirante($num_doc, $idconvocatoria);

            if($resultados){
                echo json_encode(['Aplicacion' => $resultados]);
            } else{
                echo json_encode(['Aplicacion' =>null]);
            }
        } catch (\Firebase\JWT\ExpiredException $e) {
            echo json_encode(['error' => 'Token expirado']);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            echo json_encode(['error' => 'Token con firma inválida']);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Error al procesar el token: ' . $e->getMessage()]);
        }
    }



}


?>
