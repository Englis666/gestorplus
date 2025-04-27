<?php
namespace Utils;

class PythonExecutor {
    public static function ejecutar(string $scriptPath, array $datos): array {
        if (!file_exists($scriptPath)) {
            error_log("❌ Script Python no encontrado: $scriptPath");
            return [];
        }

        if (trim(shell_exec('which python3')) === '') {
            error_log("❌ Python3 no está disponible en el entorno.");
            return [];
        }

        $inputJson = json_encode($datos, JSON_UNESCAPED_UNICODE);
        $cmd = sprintf(
            'python3 %s %s 2>&1',
            escapeshellcmd($scriptPath),
            escapeshellarg($inputJson)
        );

        $output = shell_exec($cmd);
        if ($output === null) {
            error_log("❌ El script Python no devolvió salida. Comando: $cmd");
            return [];
        }

        $result = json_decode($output, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("❌ Error decodificando JSON: " . json_last_error_msg() . "\nSalida: $output");
            return [];
        }

        return $result;
    }
}
