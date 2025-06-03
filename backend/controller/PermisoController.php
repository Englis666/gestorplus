<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Permiso;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class PermisoController extends BaseController {
    private Permiso $permiso;
    private TokenService $tokenService;

    public function __construct($permiso = null, $tokenService = null) {
        parent::__construct();
        $this->permiso = $permiso ?? new Permiso($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/permisos",
     *     tags={"Permiso"},
     *     summary="Obtener permisos del usuario autenticado",
     *     description="Devuelve los permisos del usuario autenticado usando el token JWT.",
     *     @OA\Response(
     *         response=200,
     *         description="Permisos obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="permisos", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerPermisos(): void {
        $num_doc = $this->tokenService->validarToken();
        $permisos = $this->permiso->obtenerPermisos($num_doc);
        $this->jsonResponseService->responder(['permisos' => $permisos]);
    }

    /**
     * @OA\Post(
     *     path="/permisos/solicitar",
     *     tags={"Permiso"},
     *     summary="Solicitar permiso",
     *     description="Permite al usuario autenticado solicitar un permiso.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"motivo", "fechaInicio", "fechaFin"},
     *             @OA\Property(property="motivo", type="string", example="Cita médica"),
     *             @OA\Property(property="fechaInicio", type="string", example="2024-06-01"),
     *             @OA\Property(property="fechaFin", type="string", example="2024-06-02")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Permiso solicitado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Permiso solicitado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error al solicitar el permiso"
     *     )
     * )
     */
    public function solicitarPermiso(array $data): void {
        $num_doc = $this->tokenService->validarToken();
        $mensaje = $this->permiso->solicitarPermiso($num_doc, $data)
            ? 'Permiso solicitado'
            : 'Error al solicitar el permiso';
        $this->jsonResponseService->responder(['message' => $mensaje]);
    }

    /**
     * @OA\Post(
     *     path="/permisos/aceptar",
     *     tags={"Permiso"},
     *     summary="Aceptar permisos",
     *     description="Acepta uno o varios permisos por sus IDs.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idPermisos"},
     *             @OA\Property(property="idPermisos", type="array", @OA\Items(type="integer", example=1))
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Permiso(s) aceptado(s)",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="permisoAceptado", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     )
     * )
     */
    public function permisoAceptado(array $data): void {
        if (!$this->parametrosRequeridos($data, ['idPermisos'])) {
            return;
        }
    
        $idPermisos = $data['idPermisos'];
    
        // Verificar si $idPermisos es un arreglo, si no lo es, convertirlo en un arreglo
        if (!is_array($idPermisos)) {
            $idPermisos = [$idPermisos]; // Convertirlo en un arreglo con un solo valor
        }
    
        $resultado = $this->permiso->permisoAceptado($idPermisos);
        $this->jsonResponseService->responder(['permisoAceptado' => $resultado]);
    }
    
    /**
     * @OA\Post(
     *     path="/permisos/rechazar",
     *     tags={"Permiso"},
     *     summary="Rechazar permisos",
     *     description="Rechaza uno o varios permisos por sus IDs.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idPermisos"},
     *             @OA\Property(property="idPermisos", type="array", @OA\Items(type="integer", example=1))
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Permiso(s) rechazado(s)",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="permisoRechazado", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     )
     * )
     */
    public function permisoRechazado(array $data): void {
        if (!$this->parametrosRequeridos($data, ['idPermisos'])) {
            return;
        }
    
        $idPermisos = $data['idPermisos'];
    
        if (!is_array($idPermisos)) {
            $idPermisos = [$idPermisos]; 
        }
    
        $resultado = $this->permiso->permisoRechazado($idPermisos);
        $this->jsonResponseService->responder(['permisoRechazado' => $resultado]);
    }
    

    /**
     * @OA\Get(
     *     path="/permisos/todos",
     *     tags={"Permiso"},
     *     summary="Obtener todos los permisos",
     *     description="Devuelve todos los permisos registrados en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Permisos obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="permisos", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerTodosLosPermisos(): void {
        $permisos = $this->permiso->obtenerTodosLosPermisos();
        $this->jsonResponseService->responder(['permisos' => $permisos]);
    }
}
