<?php

use PHPUnit\Framework\TestCase;
use Controller\EstadisticaController;
use Service\TokenService;
use Model\Estadistica;
use Service\JsonResponseService;

class EstadisticaControllerTest extends TestCase
{
    public function testObtenerTotalEstadisticasConTokenValido()
    {
        // Mock del TokenService
        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('obtenerPayload')->willReturn((object)[
            'data' => (object)[
                'num_doc' => '123456789',
                'rol' => 'estudiante'
            ]
        ]);

        // Mock del modelo Estadistica
        $mockEstadistica = $this->createMock(Estadistica::class);
        $mockEstadistica->method('obtenerTotalEstadisticas')->willReturn([
            'totalJornadas' => 5,
            'totalGenerales' => 10,
            'totalActualizaciones' => 3
        ]);

        // Mock de JsonResponseService para capturar respuesta
        $mockJsonResponse = $this->getMockBuilder(JsonResponseService::class)
            ->onlyMethods(['responder'])
            ->getMock();

        $mockJsonResponse->expects($this->once())
            ->method('responder')
            ->with([
                'totalJornadas' => 5,
                'totalGenerales' => 10,
                'totalActualizaciones' => 3
            ]);

        // Instanciar controlador usando reflexión para inyectar mocks
        $controller = $this->getMockBuilder(EstadisticaController::class)
            ->onlyMethods(['getTokenService', 'getEstadistica', 'getJsonResponseService'])
            ->getMock();

        $controller->method('getTokenService')->willReturn($mockTokenService);
        $controller->method('getEstadistica')->willReturn($mockEstadistica);
        $controller->method('getJsonResponseService')->willReturn($mockJsonResponse);

        // Ejecutar método
        $controller->obtenerTotalEstadisticas();
    }
}
