<?php
namespace Controlador;

use Modelo\Permiso;
use Servicio\jsonResponseService;
use Servicio\TokenService;

class PermisoController{
    private Permiso $permiso;
    private ?\PDO $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct(){
        $this->db = (new \Config\Database())->getConnection();
        $this->permiso = new Permiso($this->db);
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new jsonResponseService();
    }

    public function responder(array $data , int $httpCode = 200): void{
        $this->jsonResponseService->responder($data, $httpCode);
    }

    private function verificarDatosRequeridos(array $data, array $camposRequeridos): bool{
        foreach ($camposRequeridos as $campo){
            if (!isset($data[$campo])){
                $this->responder(['error' => "Falta el campo requerido: $campo"], 400);
                return false;
            }
        }
    return true;
    }

    public function obtenerPermisos(): void{
        $num_doc = $this->validarToken();
        $this->responder('permisos', $this->empleado->obtenerPermisos($num_doc));
    }

       
    public function solicitarPermiso(array $data): void {
        $num_doc = $this->validarToken();
        $this->responder('message', $this->empleado->solicitarPermiso($num_doc, $data) ? 'Permiso solicitado' : 'Error al solicitar el permiso');
    }

    public function permisoAceptado(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idpermiso']])) {
            return;
        }
        $resultado = $this->permiso->permisoAceptado($data['data']['idpermiso']);
        $this->responder(['Permiso' => $resultado]);
    }


    public function permisoRechazado(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idpermiso']])) {
            return;
        }
        $resultado = $this->permiso->permisoRechazado($data['data']['idpermiso']);
        $this->responder(['success' => true, 'permisoRechazado' => $resultado]);
    }

    public function obtenerTodosLosPermisos()
    {
        $this->responder(['permisos' => $this->permiso->obtenerTodosLosPermisos()]);
    }

    
}