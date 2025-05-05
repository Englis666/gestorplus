<?php
declare(strict_types=1);

namespace Controller;

use Core\Controllers\BaseController;
use Model\PazySalvo;
use Service\TokenService;
use Service\DatabaseService;
use Exception;

class PazySalvoController extends BaseController
{
    private PazySalvo $pazysalvo;
    private TokenService $tokenService;

    public function __construct()
    {
        parent::__construct();
        $this->pazysalvo = new PazySalvo($this->dbService);
        $this->tokenService = new TokenService();
    }

    public function obtenerPazYSalvos(): void
    {
        try {
            $salvos = $this->pazysalvo->obtenerPazYSalvos();
            $this->jsonResponseService->responder(['Salvos' => $salvos]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => 'Error al obtener Paz y Salvos'], 500);
        }
    }

    public function obtenerMipazYSalvo(): void
    {
        try {
            $num_doc = $this->tokenService->validarToken();
            $salvos = $this->pazysalvo->obtenerMipazYSalvo($num_doc);
            $this->jsonResponseService->responder(['Salvos' => $salvos]);
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => 'Error al obtener el Paz y Salvo'], 500);
        }
    }

    public function generarPazYSalvo(array $data): void
    {
        try {
            // Verificar si 'empleado' es un string y asignarlo a la variable
            if (isset($data['empleado'])) {
                $motivo = $data['motivo'];
                $fechaEmision = $data['fechaEmision'];
                $estado = $data['estado'];
                $empleado = $data['empleado']; // Ahora lo tomamos directamente como un string
    
                // Llamada al método para crear el Paz y Salvo
                $this->pazysalvo->crearPazYSalvo([
                    'motivo' => $motivo,
                    'fechaEmision' => $fechaEmision,
                    'estado' => $estado,
                    'empleado' => ['num_doc' => $empleado] // Aseguramos que pase como array
                ]);
    
                // Responder con mensaje de éxito
                $this->jsonResponseService->responder(['mensaje' => 'Paz y Salvo generado exitosamente']);
            } else {
                throw new Exception('Empleado no especificado correctamente en los datos');
            }
        } catch (Exception $e) {
            // En caso de error, responder con el mensaje de error y el código correspondiente
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }
    


}
