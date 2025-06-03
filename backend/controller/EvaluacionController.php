<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
*/

declare(strict_types = 1);

namespace Controller;
use Core\Controllers\BaseController;
use Model\Evaluacion;
use Service\TokenService;
use Exception;

class EvaluacionController extends BaseController{
    protected Evaluacion $evaluacion;
    protected TokenService $tokenService;

    public function __construct($evaluacion = null, $tokenService = null){
        parent::__construct();
        $this->evaluacion = $evaluacion ?? new Evaluacion($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    public function responder(array $data, int $httpCode = 200):void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    /**
     * @OA\Get(
     *     path="/evaluacion/sistema-gestion",
     *     tags={"Evaluacion"},
     *     summary="Obtener sistema de gestión",
     *     description="Obtiene el sistema de gestión para evaluación.",
     *     @OA\Response(
     *         response=200,
     *         description="Sistema de gestión obtenido",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="sistemaDeGestion", type="object")
     *         )
     *     )
     * )
     */
    public function obtenerSistemaDeGestion()
    {
        $this->responder(['sistemaDeGestion' => $this->evaluacion->obtenerSistemaDeGestion()]);
    }

    /**
     * @OA\Post(
     *     path="/evaluacion/sistema-gestion",
     *     tags={"Evaluacion"},
     *     summary="Guardar resultados del sistema de gestión",
     *     description="Guarda los resultados del sistema de gestión para una evaluación.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"identrevista", "idpostulacion", "estado_salud", "evaluacionRiesgos", "recomendaciones", "aptitudLaboral", "comentarios", "estadoEvaluacion"},
     *             @OA\Property(property="identrevista", type="integer", example=1),
     *             @OA\Property(property="idpostulacion", type="integer", example=2),
     *             @OA\Property(property="estado_salud", type="string", example="Bueno"),
     *             @OA\Property(property="evaluacionRiesgos", type="string", example="Sin riesgos"),
     *             @OA\Property(property="recomendaciones", type="string", example="Ninguna"),
     *             @OA\Property(property="aptitudLaboral", type="string", example="Apto"),
     *             @OA\Property(property="comentarios", type="string", example="Sin comentarios"),
     *             @OA\Property(property="estadoEvaluacion", type="string", example="Completada")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Resultados guardados con éxito",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Resultados guardados con éxito.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="No se pudo guardar en la base de datos"
     *     )
     * )
     */
    public function guardarResultadosSistemaDeGestion(array $data)
    {
        $required = ['identrevista', 'idpostulacion', 'estado_salud', 'evaluacionRiesgos', 'recomendaciones', 'aptitudLaboral', 'comentarios', 'estadoEvaluacion'];
        if (!$this->parametrosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->evaluacion->guardarResultadosSistemaDeGestion($data);

        if ($resultado) {
            $this->responder(['success' => true, 'message' => 'Resultados guardados con éxito.']);
        } else {
            $this->responder(['error' => 'No se pudo guardar en la base de datos.'], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/evaluacion/buscar-id",
     *     tags={"Evaluacion"},
     *     summary="Buscar ID de evaluación por entrevista",
     *     description="Busca el ID de evaluación usando el parámetro identrevista en query string.",
     *     @OA\Parameter(
     *         name="identrevista",
     *         in="query",
     *         required=true,
     *         description="Identificador de la entrevista",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="ID de evaluación encontrado o no encontrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="encontrada", type="boolean", example=true),
     *             @OA\Property(property="idevaluacion", type="integer", example=5)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Identificador de entrevista no encontrado"
     *     )
     * )
     */
    public function buscarIdEvaluacion()
    {
        $identrevista = $_GET['identrevista'] ?? null;
        if (!$identrevista) {
            $this->responder(["error" => "Identificador de entrevista no encontrado"], 400);
            return;
        }

        $evaluacion = $this->evaluacion->buscarIdEvaluacion((int) $identrevista);
        if ($evaluacion) {
            $this->responder(["encontrada" => true, "idevaluacion" => $evaluacion['idevaluacion']]);
        } else {
            $this->responder(["encontrada" => false]);
        }
    }



}