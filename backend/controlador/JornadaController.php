<?php
namespace Controlador;
use Modelo\Jornada;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class JornadaController{

    private Jornada $jornada;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->jornada = new Jornada($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
    }

    private function responder(array $data, int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    private function verificarDatosRequeridos(array $data, array $camposRequeridos): bool
    {
        foreach ($camposRequeridos as $campo) {
            if (!isset($data[$campo])) {
                $this->responder(['error' => "Falta el campo requerido: $campo"], 400);
                return false;
            }
        }
        return true;
    }

    public function corroborarJornada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idJornada']])) {
            return;
        }
        $resultado = $this->jornada->corroborarJornada($data['data']['idJornada']);
        $this->responder(['JornadaCorroborada' => $resultado]);
    }

    public function noCorroborarJornada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idJornada']])) {
            return;
        }
        $resultado = $this->jornada->noCorroborarJornada($data['data']['idJornada']);
        $this->responder(['JornadaNoCorroborada' => $resultado]);
    }

    public function obtenerTodasLasJornadas()
    {
        $this->responder(['Jornadas' => $this->jornada->obtenerTodasLasJornadas()]);
    }


  



}

?>