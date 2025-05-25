<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

if(is_writable('gestorplus/backend/uploads/')){
    echo "El directorio es escribible";
} else {
    echo "El directorio no es escribible";
}

?>
