<?php
namespace Controlador;

use Config\Database;
use Config\Clave;
use Modelo\Calculo;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class CalculoControlador{
    private $db;
    private $calculo;

    public function __construct(){
        $database = new DataBase();
        $this->db = $database->getConnection();
        $this->calculo = new Calculo($this->db);
    }

    private function jsonResponse(array $data, int $statusCode = 200):void{
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }

    private function obtenerNumDocDesdeToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        if (!$authHeader || !preg_match('/^Bearer\s+(\S+)$/', $authHeader, $matches)) {
            throw new Exception('Token no proporcionado o formato incorrecto', 401);
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
            return $decoded->data->num_doc ?? null;
        } catch (\Firebase\JWT\ExpiredException $e) {
            throw new Exception('Token expirado', 401);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            throw new Exception('Token con firma inválida', 403);
        } catch (Exception $e) {
            throw new Exception('Error al procesar el token: ' . $e->getMessage(), 400);
        }
    }

    
    private function responder(string $clave, $resultado): void{
        $this->jsonResponse([$clave => $resultado ?: []]);
    }

    public function calcularPostulacionesEnConvocatorias(){
        $this->responder('convocatorias',  $this->calculo->calcularPostulacionesEnConvocatorias());
    }

    public function calcularHorasExtra(){
        $this->responder('calculo', $this->calculo->calcularHorasExtra());
    }

    public function obtenerMinutosTrabajados(){
        $num_doc = $this->obtenerNumDocDesdeToken(); 
        $this->responder('minutosTrabajados', $this->calculo->obtenerMinutosTrabajados($num_doc));
    }
    

    public function obtenerMinutosTrabajadosDelEmpleado(){
        
        $this->responder('minutosTrabajados', $this->calculo->obtenerMinutosTrabajadosDelEmpleado());

    }


}
