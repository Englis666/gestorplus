<?php
require_once '../vendor/autoload.php';
use Config\Database;
use Modelo\Calculo;

$db = (new Database())->getConnection();
$calculo = new Calculo($db);

// Ejecutar cálculo general (para todos)
$resultado = $calculo->calcularHorasExtra();
echo "Horas extra calculadas correctamente.\n";
