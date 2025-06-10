<?php
declare(strict_types=1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Rol;
use Service\TokenService;
use Exception;

class RolController extends BaseController{

    private Rol $rol;
    private TokenService $tokenService;

    public function __construct($rol = null, $tokenService = null) {
        parent::__construct();
        $this->rol = $rol ?? new Rol($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }
    //
    /**
     * 
     * @OA\Get(
     *     path="/roles",
     *     tags={"Rol"},
     *     summary="Obtener roles",
     *     description="Devuelve todos los roles registrados en el sistema.",
     *     @OA\Response(
     *         response=200,
     *         description="Roles obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Roles", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerRoles() {
        $roles = $this->rol->obtenerRoles();
        $this->jsonResponseService->responder(['Roles' => $roles]);
    }
    /**
     * @OA\Post(
     *     path="/roles",
     *     tags={"Rol"},
     *     summary="Crear rol",
     *     description="Crea un nuevo rol en el sistema.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nombre", "descripcion"},
     *             @OA\Property(property="nombre", type="string", example="Administrador"),
     *             @OA\Property(property="descripcion", type="string", example="Rol con acceso completo al sistema")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Rol creado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Rol creado correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al crear el rol"
     *     )
     * )
     */
    public function desactivarRol(array $data) {
        if (!$this->parametrosRequeridos($data, ['idrol'])) {
            return $this->jsonResponseService->responderError('Faltan parámetros requeridos', 400);
        }

        try {
            $resultado = $this->rol->desactivarRol($data['idrol']);
            if ($resultado) {
                $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Rol desactivado correctamente']);
            } else {
                $this->jsonResponseService->responderError('Error al desactivar el rol', 500);
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }
    /*     * @OA\Post(
     *     path="/roles/activar",
     *     tags={"Rol"},
     *     summary="Activar rol",
     *     description="Activa un rol previamente desactivado.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idrol"},
     *             @OA\Property(property="idrol", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Rol activado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Rol activado correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al activar el rol"
     *     )
     * )
    */
    public function activarRol(array $data) {
        if (!$this->parametrosRequeridos($data, ['idRol'])) {
            return $this->jsonResponseService->responderError('Faltan parámetros requeridos', 400);
        }

        try {
            $resultado = $this->rol->activarRol($data['idRol']);
            if ($resultado) {
                $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Rol activado correctamente']);
            } else {
                $this->jsonResponseService->responderError('Error al activar el rol', 500);
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), 500);
        }
    }

 
   
}