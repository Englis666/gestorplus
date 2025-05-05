<?php
declare(strict_types = 1);

namespace Controller;
use Core\Controllers\BaseController;
use Model\Evaluacion;
use Service\TokenService;
use Exception;

class EvaluacionController extends BaseController{
    private Evaluacion $evaluacion;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->evaluacion = new Evaluacion($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function responder(array $data, int $httpCode = 200):void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    public function obtenerSistemaDeGestion()
    {
        $this->responder(['sistemaDeGestion' => $this->evaluacion->obtenerSistemaDeGestion()]);
    }

    public function guardarResultadosSistemaDeGestion(array $data)
    {
        $required = ['identrevista', 'idpostulacion', 'estado_salud', 'evaluacionRiesgos', 'recomendaciones', 'aptitudLaboral', 'comentarios', 'estadoEvaluacion'];
        if (!$this->parametrosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->evaluacion->guardarResultadosSistemaDeGestion($data);

        if ($resultado) {
            $this->responder(['success' => true, 'message' => 'Resultados guardados con éxito.']);
        } else {
            $this->responder(['error' => 'No se pudo guardar en la base de datos.'], 500);
        }
    }

    public function buscarIdEvaluacion()
    {
        $identrevista = $_GET['identrevista'] ?? null;
        if (!$identrevista) {
            $this->responder(["error" => "Identificador de entrevista no encontrado"], 400);
            return;
        }

        $evaluacion = $this->evaluacion->buscarIdEvaluacion($identrevista);
        if ($evaluacion) {
            $this->responder(["encontrada" => true, "idevaluacion" => $evaluacion['idevaluacion']]);
        } else {
            $this->responder(["encontrada" => false]);
        }
    }



}