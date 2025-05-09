<?php
declare(strict_types = 1);

namespace Test\Controller;

use PHPUnit\Framework\TestCase;
use Controller\EstadisticaController;
use Service\TokenService;
use Service\DatabaseService;
use Service\JsonResponseService;
use Model\Estadistica;
use PHPUnit\Framework\MockObject\MockObject;

class EstadisticaControllerTest extends TestCase
{
    private $estadisticaController;
    private $estadisticaMock;
    private $jsonResponseMock;
    private $tokenServiceMock;

    protected function setUp(): void
    {
        $this->jsonResponseMock = $this->createMock(JsonResponseService::class);
        $this->estadisticaMock = $this->createMock(Estadistica::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);

        $dbServiceMock = $this->createMock(DatabaseService::class);

        $this->estadisticaController = new EstadisticaController();

        $reflection = new \ReflectionClass($this->estadisticaController);
        $property = $reflection->getProperty('estadistica');
        $property->setAccessible(true);
        $property->setValue($this->estadisticaController, $this->estadisticaMock);

        $property = $reflection->getProperty('tokenService');
        $property->setAccessible(true);
        $property->setValue($this->estadisticaController, $this->tokenServiceMock);

        $property = $reflection->getProperty('jsonResponseService');
        $property->setAccessible(true);
        $property->setValue($this->estadisticaController, $this->jsonResponseMock);
    }

    public function testObtenerTotalEstadisticasCorrectamente()
    {
        $this->tokenServiceMock->expects($this->once())
            ->method('obtenerPayload')
            ->willReturn((object)[
                'data' => (object)[
                    'num_doc' => '123456',
                    'rol' => 'admin'
                ]
            ]);

        $this->estadisticaMock->expects($this->once())
            ->method('obtenerTotalEstadisticas')
            ->with('123456', 'admin')
            ->willReturn([
                'totalJornadas' => 4,
                'totalGenerales' => 12,
                'totalActualizaciones' => 3
            ]);

        $this->jsonResponseMock->expects($this->once())
            ->method('responder')
            ->with([
                'totalJornadas' => 4,
                'totalGenerales' => 12,
                'totalActualizaciones' => 3
            ]);

        $this->estadisticaController->obtenerTotalEstadisticas();
    }

    public function testObtenerTotalEstadisticasConPayloadInvalido()
    {
        $this->tokenServiceMock->expects($this->once())
            ->method('obtenerPayload')
            ->willReturn(null);

        $this->jsonResponseMock->expects($this->once())
            ->method('responder')
            ->with(['error' => 'Token inválido o faltan datos'], 401);

        $this->estadisticaController->obtenerTotalEstadisticas();
    }

    public function testObtenerTotalEstadisticasSinNumDoc()
    {
        $this->tokenServiceMock->expects($this->once())
            ->method('obtenerPayload')
            ->willReturn((object)[
                'data' => (object)[
                    'rol' => 'admin'
                ]
            ]);

        $this->jsonResponseMock->expects($this->once())
            ->method('responder')
            ->with(['error' => 'Token inválido o faltan datos'], 401);

        $this->estadisticaController->obtenerTotalEstadisticas();
    }
}
