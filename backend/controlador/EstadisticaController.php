<?php
declare(strict_types = 1);

namespace Controlador;
use Core\Controller\BaseController;
use Modelo\Estadistica;
use PDO;
use Exception;
use Servicio\TokenService;

 class EstadisticaController extends BaseController{

    private PDO $db;
    private Estadistica $estadistica;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->estadistica = new Estadistica($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerTotalEstadisticas(){
    $payload = $this->tokenService->obtenerPayload();

    if (!$payload || !isset($payload->data->num_doc)) {
        $this->jsonResponseService->responder(['error' => 'Token inválido o faltan datos'], 401);
        return;
    }

    $num_doc = $payload->data->num_doc;
    $rol = $payload->data->rol ?? null;

    $estadisticas = $this->estadistica->obtenerTotalEstadisticas($num_doc, $rol);

    $this->jsonResponseService->responder([
        'totalJornadas' => $estadisticas['totalJornadas'],
        'totalGenerales' => $estadisticas['totalGenerales'],
        'totalActualizaciones' => $estadisticas['totalActualizaciones']
    ]);
}

    



 }  