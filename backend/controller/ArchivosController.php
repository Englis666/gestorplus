<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types = 1);

namespace Controller;

use Core\Controllers\BaseController;
use Service\ServicioArchivos;
use Config\Database;

class ArchivosController extends BaseController {
    private ServicioArchivos $servicioArchivos;

    public function __construct($servicioArchivos = null) {
        parent::__construct();
        $this->servicioArchivos = $servicioArchivos ?? new ServicioArchivos($this->dbService);
    }

    /**
     * @OA\Post(
     *     path="/archivos/contrato",
     *     tags={"Archivos"},
     *     summary="Subir contrato en PDF",
     *     description="Permite subir un contrato en PDF para una vinculación y usuario.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"pdf_file", "idvinculacion", "num_doc"},
     *                 @OA\Property(property="pdf_file", type="string", format="binary", description="Archivo PDF del contrato"),
     *                 @OA\Property(property="idvinculacion", type="integer", example=6),
     *                 @OA\Property(property="num_doc", type="integer", example=1141114912)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contrato subido correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Contrato subido correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Faltan parámetros o archivo inválido"
     *     )
     * )
     */
    public function subirContrato() {
        if (!isset($_FILES["pdf_file"], $_POST["idvinculacion"], $_POST["num_doc"])) {
            echo json_encode(["error" => "Faltan parámetros"]);
            return;
        }

        $response = $this->servicioArchivos->subirContrato(
            $_FILES["pdf_file"],
            $_POST["idvinculacion"],
            $_POST["num_doc"]
        );
        echo json_encode($response);
    }

    
    public function obtenerContrato() {
        $num_doc = $_GET['num_doc'] ?? null;
        $response = $this->servicioArchivos->obtenerContrato($num_doc);

        if (isset($response['error'])) {
            echo json_encode($response);
            return;
        }

        $filePath = $_SERVER['DOCUMENT_ROOT'] . "/" . ltrim($response['documentoContrato'], "/");

        if (!file_exists($filePath)) {
            http_response_code(404);
            echo json_encode(["error" => "El archivo no existe.", "ruta" => $filePath]);
            return;
        }

        header("Content-Type: application/pdf");
        header("Content-Disposition: inline; filename=\"" . basename($filePath) . "\"");
        header("Content-Length: " . filesize($filePath));
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Pragma: no-cache");
        header("Expires: 0");

        readfile($filePath);
        exit;
    }
}
?>
