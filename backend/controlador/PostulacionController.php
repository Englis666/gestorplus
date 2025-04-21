<?php
declare(strict_types=1);

namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Postulacion;
use servicio\TokenService;
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
            $this->jsonResponseService->responder(['message' => 'PostulacionVerificada', 'data' => $resultados ?: []]);
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

    public function obtenerPostulacionesAgrupadasPorConvocatoria(){
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;
        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError('Parámetro idconvocatoria requerido', 400);
            return;
        }
        try{
            $resultados = $this->postulacion->obtenerPostulacionesAgrupadasPorConvocatoria($idconvocatoria);
            $this->jsonResponseService->responder(['message' => 'PostulacionAgrupadas', 'data' => $resultados ?: []]);
        } catch (Exception $e){
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode());
        }
    }
}
