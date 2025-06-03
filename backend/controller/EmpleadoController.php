<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Empleado;
use Service\TokenService;
use Exception;


class EmpleadoController extends BaseController{
    private Empleado $empleado;
    private TokenService $tokenService;
    
    public function __construct($empleado = null, $tokenService = null) {
        parent::__construct();
        $this->empleado = $empleado ?? new Empleado($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/empleados",
     *     tags={"Empleado"},
     *     summary="Obtener todos los empleados",
     *     description="Devuelve la lista de todos los empleados registrados.",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de empleados",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="empleados", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerEmpleados(): void
    {
      $this->jsonResponseService->responder(['empleados' => $this->empleado->obtenerEmpleados()]);
    }
    

    /**
     * @OA\Post(
     *     path="/empleados/queja",
     *     tags={"Empleado"},
     *     summary="Solicitar queja",
     *     description="Permite a un empleado enviar una queja. El número de documento se obtiene del token JWT.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"motivo", "descripcion"},
     *             @OA\Property(property="motivo", type="string", example="Ambiente laboral"),
     *             @OA\Property(property="descripcion", type="string", example="El ambiente laboral no es adecuado.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Queja enviada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Queja enviada")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error al enviar la queja"
     *     )
     * )
     */
    public function solicitarQueja(array $data): void {
        $num_doc = $this->tokenService->validarToken();
        $this->responder('message', $this->empleado->solicitarQueja($num_doc, $data) ? 'Queja enviada' : 'Error al enviar la queja');
    }
   
  
 
  
}
