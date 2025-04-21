<?php
declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Estudio;
use Servicio\TokenService;
use PDO;
use Exception;

class EstudioController extends BaseController
{
    private PDO $db;
    private Estudio $estudio;
    private TokenService $tokenService;

    public function __construct()
    {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->estudio = new Estudio($this->db);
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
            $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Se obtuvieron los estudios', 'obtenerEstudio' => $resultado ?: []]);

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode());
        }
    }

    public function agregarEstudio(array $data): void
    {
        try {
            $decoded = $this->tokenService->verificarToken();
            if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
                throw new Exception('Token inválido o sin acceso al ID de la hoja de vida.', 400);
            }

            $resultado = $this->estudio->agregarEstudio($data, $decoded->data->hojadevida_idHojadevida);

            if ($resultado) {
                $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Estudio agregado']);
            } else {
                throw new Exception('No se pudo agregar el estudio.', 400);
            }

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode());
        }
    }

    public function eliminarEstudio() {
        $idestudio = $_SERVER['HTTP_X_ESTUDIO_ID'] ?? null; 

        if (!$idestudio) {
            http_response_code(400);
            $this->jsonResponseService->responderError('El id del estudio no fue proporcionado.');
            return;
        }

        try {
            $resultado = $this->estudio->eliminarEstudio($idestudio);
            if ($resultado) {
                $this->jsonResponseService->responder(['status' => 'success', 'message' => 'El estudio fue eliminado correctamente.']);
            } else {
                http_response_code(500);
                $this->jsonResponseService->responderError('No se pudo eliminar el estudio');
            }
        } catch (\Exception $e) {
            http_response_code(500);
            $this->jsonResponseService->responderError('Error al eliminar el estudio: ' . $e->getMessage());
        }
    }
}
