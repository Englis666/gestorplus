<?php
if (ini_get('diplay_errors')){
    echo "Adverencia display_erros esta habilitado. Desactivalo en produccion";
} else {
    echo 'La configuracion de seguridad de PHP es adecuada';
}

?>