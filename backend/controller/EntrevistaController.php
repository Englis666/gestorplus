<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
namespace Controller;

use Core\Controllers\BaseController;
use Model\Entrevista;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class EntrevistaController extends BaseController{
    private Entrevista $entrevista; 
    private TokenService $tokenService;

    public function __construct($entrevista = null, $tokenService = null){
        parent::__construct();
        $this->entrevista = $entrevista ?? new Entrevista($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    public function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    /**
     * @OA\Post(
     *     path="/entrevista/asignar",
     *     tags={"Entrevista"},
     *     summary="Asignar entrevista",
     *     description="Asigna una nueva entrevista con fecha, hora y lugar/medio.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"fecha", "hora", "lugarMedio"},
     *             @OA\Property(property="fecha", type="string", example="2024-06-01"),
     *             @OA\Property(property="hora", type="string", example="10:00"),
     *             @OA\Property(property="lugarMedio", type="string", example="Sala de reuniones")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Entrevista asignada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Entrevista", type="object")
     *         )
     *     )
     * )
     */
    public function asignarEntrevista(array $data)
    {
        $required = ['fecha', 'hora', 'lugarMedio'];
        if (!$this->parametrosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->entrevista->asignarEntrevista($data);
        $this->responder(['Entrevista' => $resultado]);
    }

    /**
     * @OA\Get(
     *     path="/entrevista",
     *     tags={"Entrevista"},
     *     summary="Obtener entrevistas",
     *     description="Obtiene todas las entrevistas registradas.",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de entrevistas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Entrevista", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function obtenerEntrevistas()
    {
        $this->responder(['Entrevista' => $this->entrevista->obtenerEntrevistas()]);
    }

    /**
     * @OA\Get(
     *     path="/entrevista/entrevistado",
     *     tags={"Entrevista"},
     *     summary="Obtener datos del entrevistado",
     *     description="Obtiene los datos del entrevistado por número de documento.",
     *     @OA\Parameter(
     *         name="num_doc",
     *         in="query",
     *         required=true,
     *         description="Número de documento del entrevistado",
     *         @OA\Schema(type="string", example="1014736")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Datos del entrevistado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Entrevistado", type="object")
     *         )
     *     )
     * )
     */
    public function obtenerDatosDelEntrevistado(?string $num_doc = null)
    {
        $num_doc = $_GET['num_doc'] ?? $num_doc;
        $entrevistado = $this->entrevista->obtenerDatosDelEntrevistado($num_doc);
        $this->responder(["Entrevistado" => $entrevistado ?: ["error" => "No se encontraron datos para el documento proporcionado"]]);
    }

    /**
     * @OA\Post(
     *     path="/entrevista/asistencia-confirmada",
     *     tags={"Entrevista"},
     *     summary="Confirmar asistencia a entrevista",
     *     description="Confirma la asistencia a una entrevista por ID.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"identrevista"},
     *             @OA\Property(property="identrevista", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asistencia confirmada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="AsistenciaConfirmada", type="boolean", example=true)
     *         )
     *     )
     * )
     */
    public function asistenciaConfirmada(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['identrevista'])) {
            return;
        }
        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->entrevista->asistenciaConfirmada($identrevista);
        $this->jsonResponseService->responder(['AsistenciaConfirmada' => $resultado]);
    }

    /**
     * @OA\Post(
     *     path="/entrevista/asistencia-no-confirmada",
     *     tags={"Entrevista"},
     *     summary="No confirmar asistencia a entrevista",
     *     description="Marca como no confirmada la asistencia a una entrevista por ID.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"identrevista"},
     *             @OA\Property(property="identrevista", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asistencia no confirmada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="AsistenciaNoConfirmada", type="boolean", example=true)
     *         )
     *     )
     * )
     */
    public function asistenciaNoConfirmada(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['identrevista'])) {
            return;
        }

        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->entrevista->asistenciaNoConfirmada($identrevista);
        $this->jsonResponseService->responder(['AsistenciaNoConfirmada' => $resultado]);
    }


    public function rechazarEntrevistado(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['num_doc', 'identrevista'])) {
            $this->jsonResponseService->responderError('Parámetros requeridos', 400);
            return;
        }
        $num_doc = $this->getIntParam($data, 'num_doc');
        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->entrevista->rechazarEntrevistado($identrevista, $num_doc);
        $this->jsonResponseService->responder(['Rechazo' => $resultado]);
    }
}
