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
   
 
   
}