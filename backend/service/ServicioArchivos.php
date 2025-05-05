<?php
namespace Service;

use Core\Controllers\BaseController;
use Model\Archivo;
use Service\DatabaseService;
use PDO;

class ServicioArchivos extends BaseController {
   
    protected DatabaseService $dbService; 
    private Archivo $archivo;

    public function __construct() {
        parent::__construct();
        $this->dbService = new DatabaseService($this->db); 
        $this->archivo = new Archivo($this->dbService); 
    }

    public function subirContrato($pdfFile, $idvinculacion, $num_doc) {
        if (!isset($pdfFile) || $pdfFile["error"] !== 0 || 
            !is_numeric($idvinculacion) || !is_numeric($num_doc)) {
            return ["error" => "Faltan parámetros o datos inválidos"];
        }

        $nombreArchivo = basename($pdfFile["name"]);
        $directorioDestino = "uploads/";

        $tipoArchivo = strtolower(pathinfo($nombreArchivo, PATHINFO_EXTENSION));
        if ($tipoArchivo !== "pdf") {
            return ["error" => "Solo se permiten archivos PDF"];
        }

        if (!is_dir($directorioDestino)) {
            mkdir($directorioDestino, 0777, true);
        }

        $rutaArchivo = $directorioDestino . time() . "_" . $nombreArchivo;

        if (move_uploaded_file($pdfFile["tmp_name"], $rutaArchivo)) {
            $exito = $this->archivo->subirContrato($idvinculacion, $rutaArchivo, $num_doc);
            if ($exito) {
                return ["success" => true, "message" => "PDF subido correctamente", "ruta" => $rutaArchivo];
            } else {
                unlink($rutaArchivo);
                return ["error" => "Error al guardar en la base de datos"];
            }
        } else {
            return ["error" => "Error al mover el archivo"];
        }
    }

    public function obtenerContrato($num_doc) {
        if (!is_numeric($num_doc)) {
            return ["error" => "Número de documento inválido"];
        }

        $contrato = $this->archivo->obtenerContrato($num_doc);
        if (!$contrato) {
            return ["error" => "Contrato no encontrado"];
        }

        return $contrato;
    }
}
