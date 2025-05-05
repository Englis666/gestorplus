<?php
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Perfil;
use Service\TokenService;
use Exception;

class PerfilController extends BaseController {
    private Perfil $perfil;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->perfil = new Perfil($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function datosPerfil(): void {
        try {
            $num_doc = $this->tokenService->validarToken();
            $resultado = $this->perfil->datosPerfil($num_doc);

            $this->jsonResponseService->responder([
                'status'  => 'success',
                'message' => '',
                'data'    => $resultado,
            ]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError(
                ['status' => 'error', 'message' => $e->getMessage()],
                $e->getCode() ?: 500
            );
        }
    }

    public function actualizarPerfil(array $data): void {
        try {
            $num_doc = (int) $this->tokenService->validarToken();
            if (
                !isset($data['nombres'], $data['apellidos'], $data['email'], $data['tipodDoc'])
            ) {
                $this->jsonResponseService->responderError(
                    ['status' => 'error', 'message' => 'Faltan datos requeridos para actualizar el perfil'],
                    400
                );
                return;
            }
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->jsonResponseService->responderError(
                    ['status' => 'error', 'message' => 'El formato del email no es válido'],
                    400
                );
                return;
            }
            $resultado = $this->perfil->actualizarPerfil($num_doc, $data);

            if ($resultado) {
                $this->jsonResponseService->responder([
                    'status'  => 'success',
                    'message' => 'Perfil actualizado correctamente',
                ]);
            } else {
                $this->jsonResponseService->responderError(
                    ['status' => 'error', 'message' => 'No se pudo actualizar el perfil'],
                    500
                );
            }

        } catch (Exception $e) {
            $this->jsonResponseService->responderError(
                ['status' => 'error', 'message' => $e->getMessage()],
                $e->getCode() ?: 500
            );
        }
    }
}
