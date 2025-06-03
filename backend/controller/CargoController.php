<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Cargo;
use Service\TokenService;
use Exception;

class CargoController extends BaseController {
    private Cargo $cargo;
    private TokenService $tokenService;

    public function __construct($cargo = null, $tokenService = null) {
        parent::__construct();
        $this->cargo = $cargo ?? new Cargo($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/cargos",
     *     tags={"Cargo"},
     *     summary="Obtener todos los cargos",
     *     description="Devuelve la lista de todos los cargos registrados.",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de cargos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="cargos", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerCargos(){
        $this->jsonResponseService->responder(['cargos' => $this->cargo->obtenerCargos()]);
    }

    /**
     * @OA\Post(
     *     path="/cargos",
     *     tags={"Cargo"},
     *     summary="Agregar cargo",
     *     description="Agrega un nuevo cargo al sistema.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nombreCargo"},
     *             @OA\Property(property="nombreCargo", type="string", example="Analista de Soporte")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cargo agregado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="cargo", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     )
     * )
     */
    public function agregarCargo(array $data)
    {
        if (!$this->parametrosrequeridos($data, ['nombreCargo'])) {
            return;
        }
        $resultado = $this->cargo->agregarCargo($data['nombreCargo']);
        $this->jsonResponseService->responder(['success' => true, 'cargo' => $resultado]);
    }

    /**
     * @OA\Put(
     *     path="/cargos/activar",
     *     tags={"Cargo"},
     *     summary="Activar cargo",
     *     description="Activa un cargo por idCargo.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idCargo"},
     *             @OA\Property(property="idCargo", type="integer", example=4)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cargo activado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="cargo", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     )
     * )
     */
    public function activarCargo(array $data){
        if(!$this->parametrosrequeridos($data, ['idCargo'])){
            return; 
        }
    
        $resultado = $this->cargo->activarCargo((int) $data['idCargo']);
        $this->jsonResponseService->responder(['success' => true, 'cargo' => $resultado]);
    }

    /**
     * @OA\Put(
     *     path="/cargos/desactivar",
     *     tags={"Cargo"},
     *     summary="Desactivar cargo",
     *     description="Desactiva un cargo por idCargo.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idCargo"},
     *             @OA\Property(property="idCargo", type="integer", example=4)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cargo desactivado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="cargo", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros requeridos"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al desactivar el cargo"
     *     )
     * )
     */
    public function desactivarCargo(array $data){
        if(!$this->parametrosrequeridos($data, ['idCargo'])){
            return;
        }
    
        try {
            $resultado = $this->cargo->desactivarCargo((int) $data['idCargo']);
            $this->jsonResponseService->responder(['success' => true, 'cargo' => $resultado]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => $e->getMessage()], 400);
        }
    }
    
    

}