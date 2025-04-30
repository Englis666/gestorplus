<?php

declare(strict_types =1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Hojadevida;
use Service\TokenService;
use PDO;
use Exception;

class HojadevidaController extends BaseController{
    private PDO $db;
    private Hojadevida $hojadevida;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->hojadevida = new Hojadevida($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerHojadevida(): void {
        try {
            $decoded = $this->tokenService->obtenerPayload();
            if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
                throw new Exception('No se pudo obtener el ID de la hoja de vida del token.', 400);
            }
            $hojaDeVida = $this->hojadevida->obtenerHojadevida($decoded->data->hojadevida_idHojadevida);
            if (!$hojaDeVida) {
                throw new Exception('No se encontró la hoja de vida para el ID proporcionado.', 404);
            }
    
            $this->jsonResponseService->responder(['status' => 'success', 'data' => $hojaDeVida]);
    
        } catch (Exception $e) {
            $this->jsonResponseService->responderError(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function obtenerHojadevidaPorNumDoc(): void {
        try {
            // Validar parámetro num_doc
            if (!isset($_GET['num_doc']) || !is_numeric($_GET['num_doc'])) {
                $this->jsonResponseService->responderError("El número de documento es inválido", 400);
                return;
            }
        
            $num_doc = $_GET['num_doc'];
        
            // Obtener la hoja de vida por número de documento
            $hojadevida = $this->hojadevida->obtenerHojadevidaPorNumDoc((int)$num_doc);
        
            // Verificar si se encontró la hoja de vida
            if (!$hojadevida) {
                $this->jsonResponseService->responderError("No se encontró la hoja de vida", 404);
                return;
            }
        
            // Responder con éxito
            $this->jsonResponseService->responder([
                'status' => 'success',
                'data' => $hojadevida
            ]);            
        } catch (Exception $e) {
            // Responder con error
            $this->jsonResponseService->responderError(['error' => $e->getMessage()], $e->getCode());
        }
    }
    
    
    public function actualizacionHojaDevida($data): void {
        try {
            if (!$this->parametrosRequeridos($data, [
                'fechaNacimiento', 'direccion', 'ciudad', 'ciudadNacimiento', 
                'telefono', 'telefonoFijo', 'estadohojadevida', 'estadoCivil',
                'genero', 'habilidades', 'portafolio'
            ])) {
                return;
            }

            $decoded = $this->tokenService->obtenerPayload();
            if (!$decoded || !isset($decoded->data->hojadevida_idHojadevida)) {
                throw new Exception('No se puede obtener el ID de la hoja de vida del token', 400);
            }
    
            $idHojaDeVida = $decoded->data->hojadevida_idHojadevida;
        

            $hojaDeVidaActualizada = $this->hojadevida->actualizacionHojaDevida($idHojaDeVida, $data);
            if (!$hojaDeVidaActualizada) {
                throw new Exception('No se encontró la hoja de vida para el ID proporcionado', 404);
            }

            $this->jsonResponseService->responder([
                'status' => 'success',
                'data' => $hojaDeVidaActualizada
            ]);
    
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage());
        }
    }
    
    


}