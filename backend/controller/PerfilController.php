<?php
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Perfil;
use Service\TokenService;
use PDO;
use Exception;

class PerfilController extends BaseController {
    private PDO $db;
    private Perfil $perfil;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db           = (new \Config\Database())->getConnection();
        $this->perfil       = new Perfil($this->db);
        $this->tokenService = new TokenService();
    }

    public function datosPerfil(): void {
        try {
            $num_doc   = $this->tokenService->validarToken();
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

    public function actualizarPerfil($data): void {
        try {
            $num_doc = $this->tokenService->validarToken();

            // 1) Validar campos requeridos
            if (
                empty($data['nombres']) ||
                empty($data['apellidos']) ||
                empty($data['email']) ||
                empty($data['tipodDoc'])
            ) {
                $this->jsonResponseService->responderError(
                    ['status' => 'error', 'message' => 'Faltan datos requeridos para actualizar el perfil'],
                    400
                );
                return;
            }

            // 2) Intentar actualizar
            $resultado = $this->perfil->actualizarPerfil($num_doc, $data);

            // 3) Responder según resultado
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
