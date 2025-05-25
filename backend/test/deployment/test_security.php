<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

if (ini_get('diplay_errors')){
    echo "Adverencia display_erros esta habilitado. Desactivalo en produccion";
} else {
    echo 'La configuracion de seguridad de PHP es adecuada';
}

?>
