<?php
namespace Controlador;

use Modelo\Archivo;
use Config\Database;

class ArchivosControlador {
    private $db;
    private $archivo;

    public function __construct() {
        $database = new Database;
        $this->db = $database->getConnection();
        $this->archivo = new Archivo($this->db);
    }

    public function subirContrato() {
        if (!isset($_FILES["pdf_file"]) || $_FILES["pdf_file"]["error"] !== 0 || 
            !isset($_POST["idvinculacion"]) || !isset($_POST["num_doc"])) {
            echo json_encode(["error" => "Faltan parámetros"]);
            return;
        }

        $idvinculacion = filter_var($_POST["idvinculacion"], FILTER_SANITIZE_NUMBER_INT);
        $num_doc = filter_var($_POST["num_doc"], FILTER_SANITIZE_NUMBER_INT);
        if (!is_numeric($idvinculacion) || !is_numeric($num_doc)) {
            echo json_encode(["error" => "Datos inválidos"]);
            return;
        }

        $nombreArchivo = basename($_FILES["pdf_file"]["name"]);
        $directorioDestino = "uploads/";

        // Verificar que el archivo sea un PDF
        $tipoArchivo = strtolower(pathinfo($nombreArchivo, PATHINFO_EXTENSION));
        if ($tipoArchivo !== "pdf") {
            echo json_encode(["error" => "Solo se permiten archivos PDF"]);
            return;
        }

        if (!is_dir($directorioDestino)) {
            mkdir($directorioDestino, 0777, true);
        }

        $rutaArchivo = $directorioDestino . time() . "_" . $nombreArchivo;

        if (move_uploaded_file($_FILES["pdf_file"]["tmp_name"], $rutaArchivo)) {
            $exito = $this->archivo->subirContrato($idvinculacion, $rutaArchivo, $num_doc);
            if ($exito) {
                echo json_encode(["success" => true, "message" => "PDF subido correctamente", "ruta" => $rutaArchivo]);
            } else {
                unlink($rutaArchivo); // Elimina el archivo si la base de datos falla
                echo json_encode(["error" => "Error al guardar en la base de datos"]);
            }
        } else {
            echo json_encode(["error" => "Error al mover el archivo"]);
        }
    }

    public function obtenerContrato() {
    $num_doc = $_GET['num_doc'] ?? null;
    if (!$num_doc || !is_numeric($num_doc)) {
        echo json_encode(["error" => "Número de documento inválido"]);
        return;
    }

    $contrato = $this->archivo->obtenerContrato($num_doc);
    
    if (!$contrato) {
        echo json_encode(["error" => "Contrato no encontrado"]);
        return;
    }

    $filePath = $_SERVER['DOCUMENT_ROOT'] . "/" . ltrim($contrato['documentoContrato'], "/");
    
    // Debug para verificar la ruta generada
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(["error" => "El archivo no existe.", "ruta" => $filePath]);
        return;
    }

    // Configurar headers para la descarga del PDF
    header("Content-Type: application/pdf");
    header("Content-Disposition: inline; filename=\"" . basename($filePath) . "\"");
    header("Content-Length: " . filesize($filePath));

    // Evitar caché del navegador
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Pragma: no-cache");
    header("Expires: 0");

    readfile($filePath);
    exit;
}

}
?>
