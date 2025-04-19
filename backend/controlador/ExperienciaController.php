<?php
namespace Controlador;

use Modelo\Experiencia;
use Servicio\jsonResponseService;
use Servicio\TokenService;

class ExperienciaController{
    private $db;
    private Experiencia $experiencia;
    private jsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->experiencia = new Experiencia($this->db);
        $this->jsonResponseService = new jsonResponseService();
        $this->tokenService = new TokenService();
    }
    
    private function verificarToken() {
        $authHeader = apache_request_headers()['Authorization'] ?? null;
        if (!$authHeader) {
            http_response_code(401);
            $this->jsonResponse('error', 'Token no proporcionado');
            exit;
        }
        
        try {
            return JWT::decode(str_replace('Bearer ', '', $authHeader), new Key(Clave::SECRET_KEY, Clave::JWT_ALGO));
        } catch (Exception $e) {
            http_response_code(401);
            $this->jsonResponse('error', 'Token inválido: ' . $e->getMessage());
            exit;
        }
    }

    public function obtenerExperiencia() {
        $decoded = $this->tokenService->obtenerPayload(); 
        if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
            $this->jsonResponseService->responder(['status' => 'error', 'message' => 'No se pudo obtener el ID de la hoja de vida del token.'], 400);
            return;
        }

        $resultado = $this->experiencia->obtenerExperiencia($decoded->data->hojadevida_idHojadevida);
        $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Se obtuvo su experiencia laboral', 'obtenerExperiencia' => $resultado ?: []]);
    }

     //No sirve debugear
     public function eliminarExperiencia() {
        $idexperiencialaboral = $_SERVER['HTTP_X_EXPERIENCIA_ID'] ?? null; // Leer el header x-experiencia-id

        if (!$idexperiencialaboral) {
            http_response_code(400);
            $this->jsonResponseService->responder(['status' => 'error', 'message' => 'El id de la experiencia laboral no fue proporcionado.']);
            return;
        }

        try {
            $resultado = $this->experiencia->eliminarExperiencia($idexperiencialaboral);
            if ($resultado) {
                $this->jsonResponseService->responder(['status' => 'success', 'message' => 'La experiencia laboral fue eliminada correctamente.']);
            } else {
                http_response_code(500);
                $this->jsonResponseService->responder(['status' => 'error', 'message' => 'No se pudo eliminar la experiencia laboral.']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            $this->jsonResponseService->responder(['status' => 'error', 'message' => 'Error al eliminar la experiencia laboral.', 'error' => $e->getMessage()]);
        }
    }

    public function agregarExp($data) {
        $decoded = $this->verificarToken();
        $resultado = $this->experiencia->agregarExp($data, $decoded->data->hojadevida_idHojadevida);
        $this->jsonResponse($resultado ? 'success' : 'error', $resultado ? 'Experiencia agregada' : 'No se pudo agregar la experiencia');
    }

}


?>