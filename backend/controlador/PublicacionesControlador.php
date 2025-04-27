<?php
declare(strict_types = 1);

namespace Controlador;
use Core\Controller\BaseController;
use Modelo\Publicaciones;
use Servicio\TokenService;
use PDO;
use Exception;


class PublicacionesControlador extends BaseController{
    private PDO $db;
    private Publicaciones $publicaciones;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->publicaciones = new Publicaciones($this->db);
        $this->tokenService = new TokenService();
    }


    public function obtenerPublicacionPorTipoDeContrato() {
        $num_doc = $this->tokenService->validarToken();
        $publicaciones = $this->publicaciones->obtenerPublicacionPorTipoDeContrato($num_doc);
        $this->jsonResponseService->responder(['Publicaciones' => $publicaciones]);
    }
    

    public function agregarPublicacion($data) {
        $num_doc = $this->validarToken();
        
        if ($this->publicaciones->agregarPublicacion($data, $num_doc)) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación agregada exitosamente'], 201);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al agregar la publicación'], 500);
        }
    }

    public function actualizarPublicacion($data) {
        $num_doc = $this->tokenService->validarToken();

        if (empty($data['idPublicacion'])) {
            $this->jsonResponseService->responderError(['error' => 'ID de publicación no proporcionado'], 400);
        }

        if ($this->publicaciones->actualizarPublicacion($data)) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación actualizada exitosamente'], 200);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al actualizar la publicación'], 500);
        }
    }

    public function eliminarPublicacion($data) {
        $num_doc = $this->validarToken();

        if (empty($data['idPublicacion'])) {
            $this->jsonResponseService->responderError(['error' => 'ID de publicación no proporcionado'], 400);
        }
        if ($this->publicaciones->eliminarPublicacion($data['idPublicacion'])) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación eliminada exitosamente'], 200);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al eliminar la publicación'], 500);
        }
    }
}
