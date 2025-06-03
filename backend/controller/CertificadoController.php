<?php 
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Certificado;
use Service\TokenService;
use Exception;

class CertificadoController extends BaseController{
    private Certificado $certificado;
    private TokenService $tokenService;

   public function __construct($certificado = null, $tokenService = null)
    {
        parent::__construct();
        $this->certificado = $certificado ?? new Certificado($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    /**
     * @OA\Get(
     *     path="/certificado/datos",
     *     tags={"Certificado"},
     *     summary="Obtener datos para certificado",
     *     description="Obtiene los datos necesarios para generar el certificado del usuario autenticado (token).",
     *     @OA\Response(
     *         response=200,
     *         description="Datos del certificado obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="Certificado", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error al obtener los datos del certificado"
     *     )
     * )
     */
    public function obtenerDatosParaCertificado(){
        try{
         $num_doc = $this->tokenService->validarToken();
         $certificado = $this->certificado->obtenerDatosParaCertificado($num_doc);
         $this->jsonResponseService->responder(['Certificado' => $certificado]);
        } catch (Exception $e){
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }


}