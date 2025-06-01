<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
declare(strict_types =1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\Hojadevida;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class HojadevidaController extends BaseController{
    private Hojadevida $hojadevida;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->hojadevida = new Hojadevida($this->dbService);
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
    

    public function analizarHojaDeVidaPorNumDoc(): void {
        try {
            if (!isset($_GET['num_doc']) || !is_numeric($_GET['num_doc'])) {
                $this->jsonResponseService->responder([
                    'status' => 'error',
                    'visualMessage' => 'El número de documento es inválido. Por favor verifica e intenta de nuevo.'
                ], 400);
                return;
            }
            $num_doc = $_GET['num_doc'];
            if ($num_doc <= 0) {
                $this->jsonResponseService->responder([
                    'status' => 'error',
                    'visualMessage' => 'El número de documento debe ser un entero positivo.'
                ], 400);
                return;
            }

            // 1. Datos personales + experiencia y estudios
            $datos = $this->hojadevida->obtenerHojaDeVidaParaAnalizar((int) $num_doc);
            if (!$datos) {
                $this->jsonResponseService->responder([
                    'status' => 'error',
                    'visualMessage' => 'No se encontró la hoja de vida para el número de documento proporcionado.'
                ], 404);
                return;
            }

            // 2. Validar cargo y convocatoria
            if (empty($datos['idCargo']) || empty($datos['idConvocatoria'])) {
                $this->jsonResponseService->responder([
                    'status' => 'error',
                    'visualMessage' => 'No se encontró información de cargo o convocatoria para analizar la hoja de vida. El usuario debe estar postulado a una convocatoria.'
                ], 404);
                return;
            }

            // 3. Armar arrays para el microservicio Python
            $hoja = [
                'idHojadevida' => $datos['idHojadevida'],
                'fechaNacimiento' => $datos['fechaNacimiento'],
                'direccion' => $datos['direccion'],
                'ciudad' => $datos['ciudad'],
                'ciudadNacimiento' => $datos['ciudadNacimiento'],
                'telefono' => strval($datos['telefono']),
                'telefonoFijo' => strval($datos['telefonoFijo']),
                'estadohojadevida' => $datos['estadohojadevida'],
                'estadoCivil' => $datos['estadoCivil'],
                'genero' => $datos['genero'],
                'habilidades' => $datos['habilidades'],
                'portafolio' => $datos['portafolio'],
                'experiencia' => array_map(function($exp) {
                    return [
                        'profesion' => $exp['profesion'] ?? '',
                        'descripcionPerfil' => $exp['descripcionPerfil'] ?? '',
                        'fechaInicioExp' => $exp['fechaInicioExp'] ?? '',
                        'fechaFinExp' => $exp['fechaFinExp'] ?? '',
                        'cargo' => $exp['cargo'] ?? '',
                        'empresa' => $exp['empresa'] ?? '',
                        'ubicacionEmpresa' => $exp['ubicacionEmpresa'] ?? '',
                        'tipoContrato' => $exp['tipoContrato'] ?? '',
                        'salario' => $exp['salario'] ?? '',
                        'logros' => $exp['logros'] ?? '',
                        'referenciasLaborales' => $exp['referenciasLaborales'] ?? '',
                    ];
                }, $datos['experiencia'] ?? []),
                'estudios' => array_map(function($est) {
                    return [
                        'nivelEstudio' => $est['nivelEstudio'] ?? '',
                        'areaEstudio' => $est['areaEstudio'] ?? '',
                        'estadoEstudio' => $est['estadoEstudio'] ?? '',
                        'fechaInicioEstudio' => $est['fechaInicioEstudio'] ?? '',
                        'fechaFinEstudio' => $est['fechaFinEstudio'] ?? '',
                        'tituloEstudio' => $est['tituloEstudio'] ?? '',
                        'institucionEstudio' => $est['institucionEstudio'] ?? '',
                        'ubicacionEstudio' => $est['ubicacionEstudio'] ?? '',
                        'modalidad' => $est['modalidad'] ?? '',
                        'paisInstitucion' => $est['paisInstitucion'] ?? '',
                        'duracionEstudio' => $est['duracionEstudio'] ?? '',
                        'materiasDestacadas' => $est['materiasDestacadas'] ?? '',
                    ];
                }, $datos['estudios'] ?? [])
            ];

            $cargo = [
                'idcargo' => $datos['idCargo'],
                'nombreCargo' => $datos['nombreCargo'],
            ];
            $convocatoria = [
                'idconvocatoria' => $datos['idConvocatoria'],
                'nombreConvocatoria' => $datos['nombreConvocatoria'],
                'requisitos' => $datos['requisitos'],
            ];

            $payload = json_encode([
                'hoja' => $hoja,
                'cargo' => $cargo,
                'convocatoria' => $convocatoria
            ]);

            $ch = curl_init("http://gestorplus-backend-python:5000/api/analizar-hojadevida");
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($payload)
            ]);
            $response = curl_exec($ch);
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpcode !== 200 || !$response) {
                $this->jsonResponseService->responder([
                    'status' => 'error',
                    'visualMessage' => 'Ocurrió un error al analizar la hoja de vida. Intenta nuevamente más tarde.',
                    'payloadEnviado' => json_decode($payload, true) // <-- Agrega esto
                ], 500);
                return;
            }

            $this->jsonResponseService->responder([
                'status' => 'success',
                'data' => json_decode($response, true)
            ]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder([
                'status' => 'error',
                'visualMessage' => 'Error inesperado: ' . $e->getMessage()
            ], $e->getCode() ?: 500);
        }
    }
    


}