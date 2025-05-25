<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Model\Usuario;
use Core\Controllers\BaseController;
use Service\DatabaseService;
use Exception;

/**
 * @OA\Info(title="GestorPlus API", version="1.0", description="Documentación de la API de GestorPlus")
 * @OA\Server(url="http://localhost/gestorplus/backend")
 */
class UsuarioController extends BaseController {
    private Usuario $usuario;

    public function __construct() {
        parent::__construct();
        $this->usuario = new Usuario($this->dbService);
    }

    /**
     * @OA\Get(
     *     path="/gestorplus/backend/?action=obtenerRRHH",
     *     summary="Obtener información de RRHH",
     *     operationId="obtenerRRHH",
     *     tags={"Usuario"},
     *     @OA\Response(
     *         response=200,
     *         description="Información de RRHH obtenida correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="RRHH", type="array", @OA\Items(type="string"))
     *         )
     *     )
     * )
     */
    public function obtenerRRHH() {
        $resultado = $this->usuario->obtenerRRHH();
        $this->jsonResponseService->responder([
            'status' => 'success',
            'RRHH' => $resultado ?: []
        ]);
    }

    /**
     * @OA\Get(
     *     path="/gestorplus/backend/?action=obtenerUsuarios",
     *     summary="Obtener todos los usuarios",
     *     operationId="obtenerUsuarios",
     *     tags={"Usuario"},
     *     @OA\Response(
     *         response=200,
     *         description="Usuarios obtenidos correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Usuarios obtenidos correctamente"),
     *             @OA\Property(property="RRHH", type="array", @OA\Items(type="string"))
     *         )
     *     )
     * )
     */
    public function obtenerUsuarios(){
        $resultado = $this->usuario->obtenerUsuarios(); 
        $this->jsonResponseService->responder([
            'status'  => 'success',
            'message' => 'Usuarios obtenidos correctamente',
            'RRHH'    => $resultado ?: [],
        ]);
    }
}
?>
