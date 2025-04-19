<?php

namespace Controlador;

use Modelo\Hojadevida;
use Servicio\jsonResponseService;
use Servicio\TokenService;

class HojadevidaController{
    private $db;
    private Hojadevida $hojadevida;
    private jsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct($db){
        $this->db = (new \Config\Database())->getConnection();
        $this->hojadevida = new Hojadevida($this->db);
        $this->jsonResponseService = new jsonResponseSerivce();
        $this->tokenService = new TokenService();
    }

    


}