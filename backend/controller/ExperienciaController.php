<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
*/

declare(strict_types = 1);
namespace Controller;

use Core\Controllers\BaseController;
use Model\Experiencia;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class ExperienciaController extends BaseController {
    private Experiencia $experiencia;
    private TokenService $tokenService;

    public function __construct($experiencia = null, $tokenService = null) {
        parent::__construct();
        $this->experiencia = $experiencia ?? new Experiencia($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }
    
    /**
     * @OA\Get(
     *     path="/experiencia",
     *     tags={"Experiencia"},
     *     summary="Obtener experiencia laboral",
     *     description="Obtiene la experiencia laboral del usuario autenticado usando el ID de hoja de vida del token.",
     *     @OA\Response(
     *         response=200,
     *         description="Experiencia encontrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Se obtuvo su experiencia laboral"),
     *             @OA\Property(property="obtenerExperiencia", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="No se pudo obtener el ID de la hoja de vida del token"
     *     )
     * )
     */
    public function obtenerExperiencia() {
        $decoded = $this->tokenService->obtenerPayload(); 
        if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
            $this->jsonResponseService->responderError('No se pudo obtener el ID de la hoja de vida del token.');
            return;
        }

        $resultado = $this->experiencia->obtenerExperiencia($decoded->data->hojadevida_idHojadevida);
        $this->jsonResponseService->responder(['status' => 'success', 'message' => 'Se obtuvo su experiencia laboral', 'obtenerExperiencia' => $resultado ?: []]);
    }

    /**
     * @OA\Delete(
     *     path="/experiencia",
     *     tags={"Experiencia"},
     *     summary="Eliminar experiencia laboral",
     *     description="Elimina una experiencia laboral por ID usando el header X-EXPERIENCIA-ID.",
     *     @OA\Parameter(
     *         name="X-EXPERIENCIA-ID",
     *         in="header",
     *         required=true,
     *         description="ID de la experiencia laboral a eliminar",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Experiencia eliminada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="La experiencia laboral fue eliminada correctamente.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="El id de la experiencia laboral no fue proporcionado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="No se pudo eliminar la experiencia laboral"
     *     )
     * )
     */
    public function eliminarExperiencia() {
        $idexperiencialaboral = $_SERVER['HTTP_X_EXPERIENCIA_ID'] ?? null; 

        if (!$idexperiencialaboral) {
            http_response_code(400);
            $this->jsonResponseService->responderError('El id de la experiencia laboral no fue proporcionado.');
            return;
        }

        try {
            $resultado = $this->experiencia->eliminarExperiencia($idexperiencialaboral);
            if ($resultado) {
                $this->jsonResponseService->responder(['status' => 'success', 'message' => 'La experiencia laboral fue eliminada correctamente.']);
            } else {
                http_response_code(500);
                $this->jsonResponseService->responderError('No se pudo eliminar la experiencia laboral.');
            }
        } catch (\Exception $e) {
            http_response_code(500);
            $this->jsonResponseService->responderError('Error al eliminar la experiencia laboral: ' . $e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/experiencia",
     *     tags={"Experiencia"},
     *     summary="Agregar experiencia laboral",
     *     description="Agrega una nueva experiencia laboral al usuario autenticado.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"empresa", "cargo", "fechaInicio", "fechaFin", "descripcion"},
     *             @OA\Property(property="empresa", type="string", example="Empresa S.A."),
     *             @OA\Property(property="cargo", type="string", example="Desarrollador"),
     *             @OA\Property(property="fechaInicio", type="string", example="2020-01-01"),
     *             @OA\Property(property="fechaFin", type="string", example="2021-01-01"),
     *             @OA\Property(property="descripcion", type="string", example="Desarrollé aplicaciones web.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Experiencia agregada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Experiencia agregada")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="No se pudo agregar la experiencia"
     *     )
     * )
     */
    public function agregarExp($data) {
        $decoded = $this->tokenService->obtenerPayload();
        $resultado = $this->experiencia->agregarExp($data, $decoded->data->hojadevida_idHojadevida);
    
        if ($resultado) {
            $this->jsonResponseService->responder([
                'status' => 'success',
                'message' => 'Experiencia agregada'
            ]);
        } else {
            $this->jsonResponseService->responderError([
                'status' => 'error',
                'message' => 'No se pudo agregar la experiencia'
            ]);
        }
    }

    /**
     * @OA\Patch(
     *     path="/experiencia",
     *     tags={"Experiencia"},
     *     summary="Actualizar experiencia laboral",
     *     description="Actualiza una experiencia laboral existente.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idexperienciaLaboral", "empresa", "cargo", "fechaInicio", "fechaFin", "descripcion"},
     *             @OA\Property(property="idexperienciaLaboral", type="integer", example=1),
     *             @OA\Property(property="empresa", type="string", example="Empresa S.A."),
     *             @OA\Property(property="cargo", type="string", example="Desarrollador"),
     *             @OA\Property(property="fechaInicio", type="string", example="2020-01-01"),
     *             @OA\Property(property="fechaFin", type="string", example="2021-01-01"),
     *             @OA\Property(property="descripcion", type="string", example="Desarrollé aplicaciones web.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Experiencia actualizada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="ID de experiencia no proporcionado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al actualizar la experiencia"
     *     )
     * )
     */
    public function actualizarExperiencia($data) {
        try{
            $num_doc = $this->tokenService->validarToken();

            if (empty($data['idexperienciaLaboral'])) {
                $this->jsonResponseService->responderError(['error' => 'ID de experiencia no proporcionado'], 400);
            }

            if ($this->experiencia->actualizarExperiencia($data)) {
                $this->jsonResponseService->responder([
                    'status' => 'success',
                    'data' => $data
                ]);
            } else {
                $this->jsonResponseService->responderError(['error' => 'Error al actualizar la experiencia'], 500);
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage());
        }
    }
    
}
?>
