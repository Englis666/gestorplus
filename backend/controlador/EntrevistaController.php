<?php
namespace Controlador;

use Core\Controller\BaseController;
use Modelo\Entrevista;
use Servicio\TokenService;
use PDO;
use Exception;

class EntrevistaController extends BaseController{
    private PDO $db;
    private Entrevista $entrevista; 
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->entrevista = new Entrevista($this->db);
        $this->tokenService = new TokenService();
    }

    public function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    public function asignarEntrevista(array $data)
    {
        $required = ['fecha', 'hora', 'lugarMedio'];
        if (!$this->parametrosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->entrevista->asignarEntrevista($data);
        $this->responder(['Entrevista' => $resultado]);
    }

    public function obtenerEntrevistas()
    {
        $this->responder(['Entrevista' => $this->entrevista->obtenerEntrevistas()]);
    }

    
    public function obtenerDatosDelEntrevistado(?string $num_doc = null)
    {
        $num_doc = $_GET['num_doc'] ?? $num_doc;
        $entrevistado = $this->entrevista->obtenerDatosDelEntrevistado($num_doc);
        $this->responder(["Entrevistado" => $entrevistado ?: ["error" => "No se encontraron datos para el documento proporcionado"]]);
    }

    public function asistenciaConfirmada(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['identrevista'])) {
            return;
        }
        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->entrevista->asistenciaConfirmada($identrevista);
        $this->jsonResponseService->responder(['AsistenciaConfirmada' => $resultado]);
    }

    public function asistenciaNoConfirmada(array $data): void
    {
        if (!$this->parametrosRequeridos($data, ['identrevista'])) {
            return;
        }

        $identrevista = $this->getIntParam($data, 'identrevista');
        $resultado = $this->entrevista->asistenciaNoConfirmada($identrevista);
        $this->jsonResponseService->responder(['AsistenciaNoConfirmada' => $resultado]);
    }


}