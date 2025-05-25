<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */


$con = new mysqli('gestorplus-db', 'root', 'gestorplustfu', 'gestorplus');

if ($conn->connect_error){
    die("conexion fallida: " . $conn->connect_error);
}

echo "Conexion de la base de datos exitosa.";

?>
