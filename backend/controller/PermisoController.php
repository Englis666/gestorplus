<?php
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Permiso;
use Service\TokenService;
use PDO;
use Exception;

class PermisoController extends BaseController {
    private Permiso $permiso;
    private PDO $db;
    private TokenService $tokenService;

    public function __construct() {
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->permiso = new Permiso($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerPermisos(): void {
        $num_doc = $this->tokenService->validarToken();
        $permisos = $this->permiso->obtenerPermisos($num_doc);
        $this->jsonResponseService->responder(['permisos' => $permisos]);
    }

    public function solicitarPermiso(array $data): void {
        $num_doc = $this->tokenService->validarToken();
        $mensaje = $this->permiso->solicitarPermiso($num_doc, $data)
            ? 'Permiso solicitado'
            : 'Error al solicitar el permiso';
        $this->jsonResponseService->responder(['message' => $mensaje]);
    }

    public function permisoAceptado(array $data): void {
        if (!$this->parametrosRequeridos($data, ['idPermisos'])) {
            return;
        }
    
        $idPermisos = $data['idPermisos'];
    
        // Verificar si $idPermisos es un arreglo, si no lo es, convertirlo en un arreglo
        if (!is_array($idPermisos)) {
            $idPermisos = [$idPermisos]; // Convertirlo en un arreglo con un solo valor
        }
    
        $resultado = $this->permiso->permisoAceptado($idPermisos);
        $this->jsonResponseService->responder(['permisoAceptado' => $resultado]);
    }
    
    public function permisoRechazado(array $data): void {
        if (!$this->parametrosRequeridos($data, ['idPermisos'])) {
            return;
        }
    
        $idPermisos = $data['idPermisos'];
    
        if (!is_array($idPermisos)) {
            $idPermisos = [$idPermisos]; 
        }
    
        $resultado = $this->permiso->permisoRechazado($idPermisos);
        $this->jsonResponseService->responder(['permisoRechazado' => $resultado]);
    }
    

    public function obtenerTodosLosPermisos(): void {
        $permisos = $this->permiso->obtenerTodosLosPermisos();
        $this->jsonResponseService->responder(['permisos' => $permisos]);
    }
}
