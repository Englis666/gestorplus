<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types=1);

namespace Controller;

use OpenApi\Annotations as OA;
use Model\Usuario;
use Core\Controllers\BaseController;
use Service\DatabaseService;
use Exception;

/**
 * @OA\Tag(
 *     name="Usuarios",
 *     description="Endpoints relacionados con usuarios"
 * )
 */
class UsuarioController extends BaseController
{
    private Usuario $usuario;

    public function __construct($usuario = null)
    {
        parent::__construct();
        $this->usuario = new Usuario($this->dbService);
    }

    /**
     * @OA\Get(
     *     path="/usuarios",
     *     tags={"Usuarios"},
     *     operationId="obtenerUsuarios",
     *     summary="Lista de usuarios del sistema",
     *     description="Obtiene la lista de todos los usuarios del sistema. Usa ?action=obtenerUsuarios.",
     *     @OA\Parameter(
     *         name="action",
     *         in="query",
     *         required=true,
     *         description="Acción a ejecutar. Debe ser 'obtenerUsuarios' para este endpoint.",
     *         @OA\Schema(type="string", example="obtenerUsuarios")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Respuesta exitosa",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Usuarios obtenidos correctamente"),
     *             @OA\Property(
     *                 property="RRHH",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="idvinculacion", type="integer", example=6),
     *                     @OA\Property(property="fechaInicio", type="string", example="2025-03-31"),
     *                     @OA\Property(property="fechaFin", type="string", example="2025-03-31"),
     *                     @OA\Property(property="tipoContrato", type="string", example="Prestacion de Servicios"),
     *                     @OA\Property(property="salario", type="string", example="1800000.00"),
     *                     @OA\Property(property="estadoContrato", type="string", example="Activo"),
     *                     @OA\Property(property="fechaFirma", type="string", example="2025-03-31"),
     *                     @OA\Property(property="documentoContrato", type="string", example="uploads/1743565552_contrato_trabajo_ejemplo.pdf"),
     *                     @OA\Property(property="evaluacionesSg_idevaluacion", type="integer", example=14),
     *                     @OA\Property(property="usuario_num_doc", type="integer", example=1141114912),
     *                     @OA\Property(property="num_doc", type="integer", example=1141114912),
     *                     @OA\Property(property="nombres", type="string", example="Yised Dayana"),
     *                     @OA\Property(property="apellidos", type="string", example="Castiblanco Herrera"),
     *                     @OA\Property(property="email", type="string", example="yised@gmail.com"),
     *                     @OA\Property(property="tipodDoc", type="string", example="CEDULA"),
     *                     @OA\Property(property="password", type="string", example="$2y$12$GETFrXbKFQTVtQHxL.Nf3e.PveaEuAN9C9UK1Rbpk./XcHewKs//."),
     *                     @OA\Property(property="estado", type="integer", example=1),
     *                     @OA\Property(property="hojadevida_idHojadevida", type="integer", example=45),
     *                     @OA\Property(property="rol_idrol", type="integer", example=3),
     *                     @OA\Property(property="idpostulacion", type="integer", example=25),
     *                     @OA\Property(property="estadoPostulacion", type="string", example="En proceso"),
     *                     @OA\Property(property="fecha_postulacion", type="string", example="2025-03-27 21:47:59"),
     *                     @OA\Property(property="convocatoria_idconvocatoria", type="integer", example=7),
     *                     @OA\Property(property="idconvocatoria", type="integer", example=7),
     *                     @OA\Property(property="nombreConvocatoria", type="string", example="Analista de Soporte Tecnico"),
     *                     @OA\Property(property="descripcion", type="string", example="Buscamos un analista para brindar soporte tenico a los usuarios internos y mantener la infraestructura tecnologica"),
     *                     @OA\Property(property="requisitos", type="string", example="Tecnico o tecnologo en sistemas o areas relacionadas, experiencia minima de 2 a;os en soporte tecnico"),
     *                     @OA\Property(property="cantidadConvocatoria", type="integer", example=4),
     *                     @OA\Property(property="cargo_idcargo", type="integer", example=4),
     *                     @OA\Property(property="fecha_limite", type="string", example=null),
     *                     @OA\Property(property="fecha_apertura", type="string", example="2025-03-26 17:01:22"),
     *                     @OA\Property(property="idcargo", type="integer", example=4),
     *                     @OA\Property(property="nombreCargo", type="string", example="Analista de Soporte Tenico"),
     *                     @OA\Property(property="estadoCargo", type="string", example="Activo")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function obtenerUsuarios()
    {
        $resultado = $this->usuario->obtenerUsuarios();
        $this->jsonResponseService->responder([
            'status' => 'success',
            'message' => 'Usuarios obtenidos correctamente',
            'RRHH' => $resultado ?: [],
        ]);
    }

    /**
     * @OA\Get(
     *     path="/usuarios/rrhh",
     *     tags={"Usuarios"},
     *     operationId="obtenerRRHH",
     *     summary="Lista de usuarios RRHH",
     *     description="Obtiene la lista de usuarios del área de Recursos Humanos. Usa ?action=obtenerRRHH.",
     *     @OA\Parameter(
     *         name="action",
     *         in="query",
     *         required=true,
     *         description="Acción a ejecutar. Debe ser 'obtenerRRHH' para este endpoint.",
     *         @OA\Schema(type="string", example="obtenerRRHH")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Respuesta exitosa",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="RRHH",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="num_doc", type="integer", example=1014736),
     *                     @OA\Property(property="nombres", type="string", example="Englis"),
     *                     @OA\Property(property="apellidos", type="string", example="Barros"),
     *                     @OA\Property(property="nombreRol", type="string", example="Administrador")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function obtenerRRHH()
    {
        $resultado = $this->usuario->obtenerRRHH();
        $this->jsonResponseService->responder([
            'status' => 'success',
            'RRHH' => $resultado ?: []
        ]);
    }
}
?>
