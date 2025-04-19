<?php
namespace Controlador;

use Modelo\Convocatoria;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class ConvocatoriaController{
    private Convocatoria $convocatoria;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->convocatoria = new Convocatoria($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
    }

    public function responder(array $data, int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    public function verificarDatosRequeridos(array $data, array $camposRequeridos): bool{
        foreach ($camposRequeridos as $campo){
            if (!isset($data[$campo])){
                $this->responder(['error' => "Falta el campo requerido : $campo"], 400);
                return false;
            }
        }
    return true;
    }

    public function agregarConvocatoria(array $data){
        $required = ['nombreConvocatoria', 'descripcion', 'requisitos', 'salario', 'cantidadConvocatoria', 'idcargo'];
        if(!$this->verificarDatosRequeridos($data, $required)){
            return;
        }
        $resultado = $this->convocatoria->agregarConvocatoria($data);
        $this->responder(['Convocatoria' => $resultado]);
    }

    public function obtenerConvocatorias()
    {
        $this->responder(['convocatorias' => $this->convocatoria->obtenerConvocatorias()]);
    }

    public function obtenerDetalleConvocatoria() {
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;

        if (!$idconvocatoria) {
            $this->responder(['error' => "No se encontró la convocatoria"], 400);
            return;
        }

        try {
            $detalleConvocatoria = $this->aspirante->obtenerDetalleConvocatoria($idconvocatoria);
            if (!$detalleConvocatoria) {
                $this->responder(['message' => "No se encontraron detalles para esta convocatoria", 'data' => []], 404);
                return;
            }
            $this->responder(['message' => 'DetalleConvocatoria', 'data' => $detalleConvocatoria]);
        } catch (Exception $e) {
            $this->responder(['error' => $e->getMessage()], $e->getCode());
        }
    }


}


?>