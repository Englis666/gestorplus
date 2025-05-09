<?php

$con = new mysqli('gestorplus-db', 'root', 'gestorplustfu', 'gestorplus');

if ($conn->connect_error){
    die("conexion fallida: " . $conn->connect_error);
}

echo "Conexion de la base de datos exitosa.";

?>