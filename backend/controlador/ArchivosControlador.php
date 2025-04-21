<?php
namespace Controlador;

use Core\Controller\BaseController;
use Servicio\ServicioArchivos;
use Config\Database;

class ArchivosControlador extends BaseController {
    private $servicioArchivos;

    public function __construct() {
        parent::__construct();
        $db = (new Database())->getConnection();
        $this->servicioArchivos = new ServicioArchivos($db);
    }

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
