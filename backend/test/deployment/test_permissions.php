<?php
if(is_writable('gestorplus/backend/uploads/')){
    echo "El directorio es escribible";
} else {
    echo "El directorio no es escribible";
}

?>