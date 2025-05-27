<?php
namespace Service;

use Predis\Client as RedisClient;

class AntiAttackForce{
    private $redis;
    private $maxLoginAttempts = 5;
    private $loginBlockTime = 600;

    public function __construct(RedisClient $redis) {
        $this->redis = $redis;
    }

    public function checkLoginAttempts($userNameOrIp): void{
        $key = "login_attempts:{$userNameOrIp}";
        $attempts = $this->redis->get($key);

        if($attempts !== null && $attempts >= $this->maxLoginAttempts){
            http_response_code(429);
            echo json_encode(['message' => 'Demasiados intentos de inicio de sesión. Inténtalo más tarde.']);
            exit;
        }
    }

    public function registerLoginAttempt($userNameOrIp, $success): void{
        $key = "login_attempts:{$userNameOrIp}";
        if($success){
            $this->redis->del($key);
        } else {
            $this->redis->incr($key);
            $this->redis->expire($key, $this->loginBlockTime);
        }
    }

    public function detectSuspiciousUserAgent(){
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $SUS = ['sqlmap', 'curl', 'nmap', 'nikto', 'dirbuster', 'burpsuite', 'sqlninja', 'sqlsus', 'sqlmap.py', 'bash', 'wget', 'python', 'php', 'perl', 'ruby', 'java', 'go', 'nodejs', 'javascript'];
        foreach ($SUS as $sus) {
            if (stripos($userAgent, $sus) !== false) {
                http_response_code(403);
                echo json_encode(['message' => 'Acceso denegado. User-Agent SUS detectado.']);
                exit;
            }
        }
    }
}