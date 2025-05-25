<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Estudio;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class EstudioController extends BaseController {
    private Estudio $estudio;
    private TokenService $tokenService;

    public function __construct()
    {
        parent::__construct();
        $this->estudio = new Estudio($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function obtenerEstudio(): void
    {
        try {
            $decoded = $this->tokenService->obtenerPayload();

            if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
                throw new Exception('No se pudo obtener el ID de la hoja de vida del token.', 400);
            }

            $resultado = $this->estudio->obtenerEstudio($decoded->data->hojadevida_idHojadevida);

            $this->jsonResponseService->responder([
                'status' => 'success',
                'message' => 'Se obtuvieron los estudios',
                'obtenerEstudio' => $resultado ?: []
            ]);

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $this->getValidStatusCode($e));
        }
    }

    public function agregarEstudio(array $data): void
    {
        try {
            $decoded = $this->tokenService->obtenerPayload();

            if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
                throw new Exception('Token inválido o sin acceso al ID de la hoja de vida.', 400);
            }

            $resultado = $this->estudio->agregarEstudio($data, $decoded->data->hojadevida_idHojadevida);

            if ($resultado) {
                $this->jsonResponseService->responder([
                    'status' => 'success',
                    'message' => 'Estudio agregado'
                ]);
            } else {
                throw new Exception('No se pudo agregar el estudio.', 400);
            }

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $this->getValidStatusCode($e));
        }
    }

    public function actualizarEstudio(array $data): void
    {
        try {
            $num_doc = $this->tokenService->validarToken();

            if (empty($data['idestudio'])) {
                throw new Exception('ID de estudio no proporcionado.', 400);
            }

            if ($this->estudio->actualizarEstudio($data)) {
                $this->jsonResponseService->responder([
                    'status' => 'success',
                    'data' => $data
                ]);
            } else {
                throw new Exception('Error al actualizar el estudio.', 500);
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $this->getValidStatusCode($e));
        }
    }

    public function eliminarEstudio(): void
    {
        try {
            $idestudio = $_SERVER['HTTP_X_ESTUDIO_ID'] ?? null; 

            if (!$idestudio) {
                throw new Exception('El id del estudio no fue proporcionado.', 400);
            }

            $resultado = $this->estudio->eliminarEstudio($idestudio);

            if ($resultado) {
                $this->jsonResponseService->responder([
                    'status' => 'success',
                    'message' => 'El estudio fue eliminado correctamente.'
                ]);
            } else {
                throw new Exception('No se pudo eliminar el estudio.', 500);
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $this->getValidStatusCode($e));
        }
    }

    /**
     * Método privado para asegurar que el código de error sea un int válido
     */
    private function getValidStatusCode(Exception $e): int
    {
        $code = $e->getCode();
        return (is_int($code) && $code >= 100 && $code < 600) ? $code : 500;
    }
}
