<?php
$url = 'https//';
$response = file_get_contents($url);

if($response){
    echo 'La integracion con el servicio externo funciono correctamente';
} else{ 
    echo 'Fallo en la integracion con el servicio extero';
}

?>
