<?php

require_once '../vendor/autoload.php';
require_once '/MigrarExcel.php';

use Migrations\MigrarExcel;

if ($argc < 2) {
    echo "Uso: php MigrarExcelRunner.php ruta_del_archivo\n";
    exit(1);
}

$filename = $argv[1];

// Verificar si el archivo existe
if (!file_exists($filename)) {
    echo "Error: El archivo '$filename' no existe.\n";
    exit(1);
}

try {
    // Crear una instancia de MigrarExcel
    $migrador = new MigrarExcel();
    
    // Llamar al método importarExcel para procesar el archivo
    $migrador->importarExcel($filename);
} catch (Exception $e) {
    // Capturar cualquier excepción que ocurra durante la migración
    echo "Se produjo un error al realizar la migración: " . $e->getMessage() . "\n";
    exit(1);
}
