<?php
declare(strict_types = 1);
namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Experiencia;
use Servicio\TokenService;
use PDO;
use Exception;

class ExperienciaController extends BaseController {
    private PDO $db;
    private Experiencia $experiencia;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->experiencia = new Experiencia($this->db);
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
        $decoded = $this->verificarToken();
        $resultado = $this->experiencia->agregarExp($data, $decoded->data->hojadevida_idHojadevida);
        $this->jsonResponse($resultado ? 'success' : 'error', $resultado ? 'Experiencia agregada' : 'No se pudo agregar la experiencia');
    }
}
?>
