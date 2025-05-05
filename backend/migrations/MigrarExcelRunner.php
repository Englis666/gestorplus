<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/MigrarExcel.php';

use Migrations\MigrarExcel;

if ($argc < 2) {
    echo "Uso: php MigrarExcelRunner.php rutaquedaelbash";
    exit(1);
}

$filename = $argv[1];
$migrador = new MigrarExcel();
$migrador->importarExcel($filename);