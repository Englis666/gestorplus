<?php
namespace Controlador;
use Modelo\Evaluacion;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class EvaluacionController{
    private Evaluacion $evaluacion;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->evaluacion = new Evaluacion($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
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
        if (!$this->verificarDatosRequeridos($data, $required)) {
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