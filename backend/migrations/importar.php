<?php
namespace Migrations;

require_once '../vendor/autoload.php';

use Migrations\MigrarExcel;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['archivo'])) {
    $archivo = $_FILES['archivo']['tmp_name'];

    if (is_uploaded_file($archivo)) {
        $importador = new MigrarExcel();
        $importador->importarExcel($archivo);
    } else {
        echo "Error al subir el archivo.";
    }
} else {
    echo "No se recibió ningún archivo.";
}
