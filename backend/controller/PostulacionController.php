<?php
declare(strict_types=1);

namespace Controller;

use Utils\PythonExecutor;
use Core\Controllers\BaseController;
use Model\Postulacion;
use service\TokenService;
use PDO;
use Exception;

class PostulacionController extends BaseController{
    private PDO $db;
    private Postulacion $postulacion;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->postulacion = new Postulacion($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerPostulaciones() {
        $this->jsonResponseService->responder(['Postulaciones' => $this->postulacion->obtenerPostulaciones()]);
    }

    public function obtenerConvocatoriasPostulaciones() {
        $this->jsonResponseService->responder(['ConvocatoriaPostulaciones' => $this->postulacion->obtenerConvocatoriasPostulaciones()]);
    }

    public function verificarPostulacion() {
        $num_doc = $this->tokenService->validarToken();
        if ($num_doc === null) return;

        $idconvocatoria = $_GET['idconvocatoria'] ?? null;
        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError('Parámetro idconvocatoria requerido', 400);
            return;
        }

        try {
            $resultados = $this->postulacion->verificarPostulacion($num_doc, $idconvocatoria);
            $this->jsonResponseService->responder(['status' => 'PostulacionVerificada', 'data' => $resultados]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function obtenerPostulacionesAspirante() {
        $num_doc = $this->tokenService->validarToken();
        if ($num_doc === null) return;

        try {
            $postulaciones = $this->postulacion->obtenerPostulacionesAspirante($num_doc);
            if (!$postulaciones) {
                $this->jsonResponseService->responderError('No hay postulaciones', 404);
                return;
            }
            $this->jsonResponseService->responder(['message' => 'MisPostulaciones', 'data' => $postulaciones]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Obtiene postulaciones agrupadas por convocatoria 
     */
    public function obtenerPostulacionesAgrupadasPorConvocatoria() {
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;
        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError('Parámetro idconvocatoria requerido', 400);
            return;
        }
    
        try {
            $postulantes = $this->postulacion->obtenerPostulacionesAgrupadasPorConvocatoria((int)$idconvocatoria);   
            if (empty($postulantes)) {
                $this->jsonResponseService->responderError('No hay postulantes para esta convocatoria', 404);
                return;
            }
            $this->jsonResponseService->responder(['data' => $postulantes]);
    
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

}
