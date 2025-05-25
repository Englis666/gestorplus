<?php

namespace Service;

class LogService {
    private string $logFilePath;

    public function __construct(string $logFilePath) {
        $this->logFilePath = $logFilePath;
    }

    public function log(string $message): void {
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($this->logFilePath, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
    }
    
}