<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Publicaciones;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class PublicacionesController extends BaseController {
    private Publicaciones $publicaciones;
    private TokenService $tokenService;

    public function __construct($publicaciones = null, $tokenService = null) {
        parent::__construct();
        $this->publicaciones = $publicaciones ?? new Publicaciones($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    public function obtenerPublicacionPorTipoDeContrato() {
        $num_doc = (int) $this->tokenService->validarToken();
        $publicaciones = $this->publicaciones->obtenerPublicacionPorTipoDeContrato($num_doc);
        $this->jsonResponseService->responder(['Publicaciones' => $publicaciones]);
    }

    public function agregarPublicacion($data) {
        $num_doc = (int) $this->tokenService->validarToken();

        if ($this->publicaciones->agregarPublicacion($data, $num_doc)) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación agregada exitosamente'], 201);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al agregar la publicación'], 500);
        }
    }

    public function actualizarPublicacion($data) {
        $num_doc = (int) $this->tokenService->validarToken();

        if (empty($data['idPublicacion'])) {
            $this->jsonResponseService->responderError(['error' => 'ID de publicación no proporcionado'], 400);
            return; 
        }

        if ($this->publicaciones->actualizarPublicacion($data)) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación actualizada exitosamente'], 200);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al actualizar la publicación'], 500);
        }
    }

    public function eliminarPublicacion($data) {
        $num_doc = (int) $this->tokenService->validarToken(); 

        if (empty($data['idPublicacion'])) {
            $this->jsonResponseService->responderError(['error' => 'ID de publicación no proporcionado'], 400);
            return; 
        }

        if ($this->publicaciones->eliminarPublicacion($data['idPublicacion'])) {
            $this->jsonResponseService->responder(['mensaje' => 'Publicación eliminada exitosamente'], 200);
        } else {
            $this->jsonResponseService->responderError(['error' => 'Error al eliminar la publicación'], 500);
        }
    }
}
