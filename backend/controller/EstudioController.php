<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Estudio;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class EstudioController extends BaseController {
    protected TokenService $tokenService;
    protected Estudio $estudio;

    public function __construct($estudio = null, $tokenService = null)
    {
        parent::__construct();
        $this->estudio = $estudio ?? new Estudio($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/estudio",
     *     tags={"Estudio"},
     *     summary="Obtener estudios del usuario autenticado",
     *     description="Obtiene los estudios usando el ID de hoja de vida extraído del token JWT.",
     *     @OA\Response(
     *         response=200,
     *         description="Estudios encontrados",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Se obtuvieron los estudios"),
     *             @OA\Property(property="obtenerEstudio", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="No se pudo obtener el ID de la hoja de vida del token."
     *     )
     * )
     */
    public function obtenerEstudio(): void
    {
        try {
            $decoded = $this->tokenService->obtenerPayload();

            if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
                throw new Exception('No se pudo obtener el ID de la hoja de vida del token.', 400);
            }

            $resultado = $this->estudio->obtenerEstudio($decoded->data->hojadevida_idHojadevida);

            $this->jsonResponseService->responder([
                'status' => 'success',
                'message' => 'Se obtuvieron los estudios',
                'obtenerEstudio' => $resultado ?: []
            ]);

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $this->getValidStatusCode($e));
        }
    }

    /**
     * @OA\Post(
     *     path="/estudio",
     *     tags={"Estudio"},
     *     summary="Agregar estudio",
     *     description="Agrega un nuevo estudio al usuario autenticado.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"titulo", "institucion", "fechaInicio", "fechaFin", "nivel"},
     *             @OA\Property(property="titulo", type="string", example="Ingeniero de Sistemas"),
     *             @OA\Property(property="institucion", type="string", example="Universidad Nacional"),
     *             @OA\Property(property="fechaInicio", type="string", example="2015-01-01"),
     *             @OA\Property(property="fechaFin", type="string", example="2020-01-01"),
     *             @OA\Property(property="nivel", type="string", example="Universitario")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Estudio agregado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Estudio agregado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="No se pudo agregar el estudio."
     *     )
     * )
     */
    public function agregarEstudio(array $data): void
    {
        try {
            $decoded = $this->tokenService->obtenerPayload();

            if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
                throw new Exception('Token inválido o sin acceso al ID de la hoja de vida.', 400);
            }

            $resultado = $this->estudio->agregarEstudio($data, $decoded->data->hojadevida_idHojadevida);

            if ($resultado) {
                $this->jsonResponseService->responder([
                    'status' => 'success',
                    'message' => 'Estudio agregado'
                ]);
            } else {
                throw new Exception('No se pudo agregar el estudio.', 400);
            }

        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $this->getValidStatusCode($e));
        }
    }

    /**
     * @OA\Put(
     *     path="/estudio",
     *     tags={"Estudio"},
     *     summary="Actualizar estudio",
     *     description="Actualiza un estudio existente.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"idestudio", "titulo", "institucion", "fechaInicio", "fechaFin", "nivel"},
     *             @OA\Property(property="idestudio", type="integer", example=1),
     *             @OA\Property(property="titulo", type="string", example="Ingeniero de Sistemas"),
     *             @OA\Property(property="institucion", type="string", example="Universidad Nacional"),
     *             @OA\Property(property="fechaInicio", type="string", example="2015-01-01"),
     *             @OA\Property(property="fechaFin", type="string", example="2020-01-01"),
     *             @OA\Property(property="nivel", type="string", example="Universitario")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Estudio actualizado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="ID de estudio no proporcionado."
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al actualizar el estudio."
     *     )
     * )
     */
    public function actualizarEstudio(array $data): void
    {
        try {
            $num_doc = $this->tokenService->validarToken();

            if (empty($data['idestudio'])) {
                throw new Exception('ID de estudio no proporcionado.', 400);
            }

            if ($this->estudio->actualizarEstudio($data)) {
                $this->jsonResponseService->responder([
                    'status' => 'success',
                    'data' => $data
                ]);
            } else {
                throw new Exception('Error al actualizar el estudio.', 500);
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $this->getValidStatusCode($e));
        }
    }

    /**
     * @OA\Delete(
     *     path="/estudio",
     *     tags={"Estudio"},
     *     summary="Eliminar estudio",
     *     description="Elimina un estudio por ID usando el header X-ESTUDIO-ID.",
     *     @OA\Parameter(
     *         name="X-ESTUDIO-ID",
     *         in="header",
     *         required=true,
     *         description="ID del estudio a eliminar",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Estudio eliminado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="El estudio fue eliminado correctamente.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="El id del estudio no fue proporcionado."
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="No se pudo eliminar el estudio."
     *     )
     * )
     */
    public function eliminarEstudio(): void
    {
        try {
            $idestudio = $_SERVER['HTTP_X_ESTUDIO_ID'] ?? null; 

            if (!$idestudio) {
                throw new Exception('El id del estudio no fue proporcionado.', 400);
            }

            $resultado = $this->estudio->eliminarEstudio($idestudio);

            if ($resultado) {
                $this->jsonResponseService->responder([
                    'status' => 'success',
                    'message' => 'El estudio fue eliminado correctamente.'
                ]);
            } else {
                throw new Exception('No se pudo eliminar el estudio.', 500);
            }
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $this->getValidStatusCode($e));
        }
    }

    /**
     * Método privado para asegurar que el código de error sea un int válido
     */
    private function getValidStatusCode(Exception $e): int
    {
        $code = $e->getCode();
        return (is_int($code) && $code >= 100 && $code < 600) ? $code : 500;
    }
}
