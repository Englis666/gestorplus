<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
*/

declare(strict_types = 1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Experiencia;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class ExperienciaController extends BaseController {
    private Experiencia $experiencia;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->experiencia = new Experiencia($this->dbService);
        $this->tokenService = new TokenService();
    }
    
    public function obtenerExperiencia() {
        $decoded = $this->tokenService->obtenerPayload(); 
        if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
            $this->jsonResponseService->responderError('No se pudo obtener el ID de la hoja de vida del token.');
            return;
        }

        $resultado = $this->experiencia->obtenerExperiencia($decoded->data->hojadevida_idHojadevida);
        $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Se obtuvo su experiencia laboral', 'obtenerExperiencia' => $resultado ?: []]);
    }

    public function eliminarExperiencia() {
        $idexperiencialaboral = $_SERVER['HTTP_X_EXPERIENCIA_ID'] ?? null; 

        if (!$idexperiencialaboral) {
            http_response_code(400);
            $this->jsonResponseService->responderError('El id de la experiencia laboral no fue proporcionado.');
            return;
        }

        try {
            $resultado = $this->experiencia->eliminarExperiencia($idexperiencialaboral);
            if ($resultado) {
                $this->jsonResponseService->responder(['status' => 'success', 'message' => 'La experiencia laboral fue eliminada correctamente.']);
            } else {
                http_response_code(500);
                $this->jsonResponseService->responderError('No se pudo eliminar la experiencia laboral.');
            }
        } catch (\Exception $e) {
            http_response_code(500);
            $this->jsonResponseService->responderError('Error al eliminar la experiencia laboral: ' . $e->getMessage());
        }
    }

    public function agregarExp($data) {
        $decoded = $this->tokenService->obtenerPayload();
        $resultado = $this->experiencia->agregarExp($data, $decoded->data->hojadevida_idHojadevida);
    
        if ($resultado) {
            $this->jsonResponseService->responder([
                'status' => 'success',
                'message' => 'Experiencia agregada'
            ]);
        } else {
            $this->jsonResponseService->responderError([
                'status' => 'error',
                'message' => 'No se pudo agregar la experiencia'
            ]);
        }
    }

    public function actualizarExperiencia($data) {
        try{
            $num_doc = $this->tokenService->validarToken();

            if (empty($data['idexperienciaLaboral'])) {
                $this->jsonResponseService->responderError(['error' => 'ID de experiencia no proporcionado'], 400);
            }

            if ($this->experiencia->actualizarExperiencia($data)) {
                $this->jsonResponseService->responder([
                    'status' => 'success',
                    'data' => $data
                ]);
            } else {
                $this->jsonResponseService->responderError(['error' => 'Error al actualizar la experiencia'], 500);
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage());
        }
    }
    
}
?>
