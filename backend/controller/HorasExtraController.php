<?php
namespace Controller;

use Core\Controllers\BaseController;
use Model\HorasExtra;
use Service\TokenService;
use Exception;

class HorasExtraController extends BaseController{
    private HorasExtra $horasExtra;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->horasExtra = new HorasExtra($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function obtenerTodasLasHorasExtra()
    {
        $this->jsonResponseService->responder($this->horasExtra->obtenerTodasLasHorasExtra());
    }

    public function consultarHorasExtra(){
        $decoded = $this->verificarToken();

        $resultado = $this->usuario->consultarhorasExtra($decoded->data->num_doc);
        $this->jsonResponseService->responder($resultado ? 'success' : 'error' , $resultado ? 'Horas extra consultadas' : 'No se pudo consultar las horas extra');
    }


    public function calcularHorasExtra($frame){
        $response = $this->horasExtraService->calcularHorasExtra($frame);
        return $response;
    }


}