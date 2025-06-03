<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Perfil;
use Service\TokenService;
use Exception;

class PerfilController extends BaseController {
    protected Perfil $perfil;
    protected TokenService $tokenService;

    public function __construct($perfil = null, $tokenService = null) {
        parent::__construct();
        $this->perfil = $perfil ?? new Perfil($this->dbService); 
        $this->tokenService = $tokenService ?? new TokenService();  
    }
    

    /**
     * @OA\Get(
     *     path="/perfil",
     *     tags={"Perfil"},
     *     summary="Obtener datos del perfil",
     *     description="Devuelve los datos del perfil del usuario autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="Datos del perfil obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example=""),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener los datos del perfil"
     *     )
     * )
     */
    public function datosPerfil(): void {
        try {
            $num_doc = (int) $this->tokenService->validarToken();
            $resultado = $this->perfil->datosPerfil($num_doc);

            $this->jsonResponseService->responder([
                'status'  => 'success',
                'message' => '',
                'data'    => $resultado,
            ]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError(
                ['status' => 'error', 'message' => $e->getMessage()],
                $e->getCode() ?: 500
            );
        }
    }

    /**
     * @OA\Put(
     *     path="/perfil",
     *     tags={"Perfil"},
     *     summary="Actualizar perfil",
     *     description="Actualiza los datos del perfil del usuario autenticado (token).",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nombres", "apellidos", "email", "tipodDoc"},
     *             @OA\Property(property="nombres", type="string", example="Juan"),
     *             @OA\Property(property="apellidos", type="string", example="Pérez"),
     *             @OA\Property(property="email", type="string", example="juan.perez@email.com"),
     *             @OA\Property(property="tipodDoc", type="string", example="CEDULA")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Perfil actualizado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Perfil actualizado correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan datos requeridos o email inválido"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="No se pudo actualizar el perfil"
     *     )
     * )
     */
    public function actualizarPerfil(array $data): void {
        try {
            $num_doc = (int) $this->tokenService->validarToken();
            if (
                !isset($data['nombres'], $data['apellidos'], $data['email'], $data['tipodDoc'])
            ) {
                $this->jsonResponseService->responderError(
                    ['status' => 'error', 'message' => 'Faltan datos requeridos para actualizar el perfil'],
                    400
                );
                return;
            }
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->jsonResponseService->responderError(
                    ['status' => 'error', 'message' => 'El formato del email no es válido'],
                    400
                );
                return;
            }
            $resultado = $this->perfil->actualizarPerfil($num_doc, $data);

            if ($resultado) {
                $this->jsonResponseService->responder([
                    'status'  => 'success',
                    'message' => 'Perfil actualizado correctamente',
                ]);
            } else {
                $this->jsonResponseService->responderError(
                    ['status' => 'error', 'message' => 'No se pudo actualizar el perfil'],
                    500
                );
            }

        } catch (Exception $e) {
            $this->jsonResponseService->responderError(
                ['status' => 'error', 'message' => $e->getMessage()],
                $e->getCode() ?: 500
            );
        }
    }
}
