<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
namespace Controller;

use Core\Controllers\BaseController;
use Model\HorasExtra;
use Service\TokenService;
use Exception;

class HorasExtraController extends BaseController{
    private HorasExtra $horasExtra;
    private TokenService $tokenService;

    public function __construct($horasExtra = null, $tokenService = null) {
        parent::__construct();
        $this->horasExtra = $horasExtra ?? new HorasExtra($this->dbService);
        $this->tokenService = $tokenService ?? new TokenService();
    }

    public function obtenerTodasLasHorasExtra()
    {
        $datos = $this->horasExtra->obtenerTodasLasHorasExtra();
        $this->jsonResponseService->responder([
            'status' => 'success',
            'calculo' => $datos
        ]);
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