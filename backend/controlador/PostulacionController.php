<?php
namespace Controlador;

use Modelo\Postulacion;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class PostulacionController{
    private Postulacion $postulacion;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->postulacion = new Postulacion($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
    }
    public function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data , $httpCode);
    }
    public function verificarDatosRequeridos(array $data, array $camposRequeridos): boold{
        foreach ($camposRequeridos as $campo){
            if (!isset($data[$campo])){
                $this->responder(['error' => "Falta el campo requerido: $campo"], 400);
                return false;
            }
        }
    return false;
    }

    public function obtenerPostulaciones()
    {
        $this->responder(['Postulaciones' => $this->postulacion->obtenerPostulaciones()]);
    }


    public function obtenerConvocatoriasPostulaciones()
    {
        $this->responder(['ConvocatoriaPostulaciones' => $this->postulacion->obtenerConvocatoriasPostulaciones()]);
    }
    

    public function verificarPostulacion() {
        $num_doc = $this->obtenerNumDocDesdeToken();
        if ($num_doc === null) return;
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;

        if (!$idconvocatoria) {
            $this->responder(['error' => 'Datos insuficientes'], 400);
            return;
        }

        try {
            $resultados = $this->postulacion->verificarPostulacion($num_doc, $idconvocatoria);
            $this->responder(['message' => 'PostulacionVerificada', 'data' => $resultados ?: []]);
        } catch (Exception $e) {
            $this->responder(['error' => $e->getMessage()], $e->getCode());
        }
    }

    


    public function obtenerPostulacionesAspirante() {
        $num_doc = $this->obtenerNumDocDesdeToken();
        if ($num_doc === null) return;
        try {
            $postulaciones = $this->postulacion->obtenerPostulacionespostulacion($num_doc);
            if (!$postulaciones) {
                $this->responder(['message' => 'No hay postulaciones', 'data' => []], 404);
                return;
            }
            $this->responder(['message' => 'MisPostulaciones', 'data' => $postulaciones]);
        } catch (Exception $e) {
            $this->responder(['error' => $e->getMessage()], $e->getCode());
        }
    }

   




}