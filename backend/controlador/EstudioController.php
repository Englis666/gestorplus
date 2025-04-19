<?php
namespace Controlador;

use Modelo\Estudio;
use Servicio\jsonResponseService;
use Servicio\TokenService;

class EstudioController{
    private Estudio $estudio;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->estudio = new Estudio($this->db);
        $this->jsonResponseService = new jsonResponseService();
        $this->tokenService = new TokenService();
    }

    private function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data,$httpCode);
    }

    public function obtenerEstudio(){
        $decoded = $this->tokenService->obtenerPayload();
        if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
            $this->jsonResponseService->responder(['status' => 'error', 'message' => 'No se pudo obtener el ID de la hoja de vida del token.'], 400);
            return;
        }
        $resultado = $this->estudio->obtenerEstudio($decoded->data->hojadevida_idHojadevida);
        $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Se obtuvo los estudios', 'obtenerEstudio' => $resultado ?: []]);
    }

    public function agregarEstudio($data) {
        $decoded = $this->verificarToken();
        $resultado = $this->estudio->agregarEstudio($data, $decoded->data->hojadevida_idHojadevida);
        $this->jsonResponse($resultado ? 'success' : 'error', $resultado ? 'Estudio agregado' : 'No se pudo agregar el estudio');
    }

}