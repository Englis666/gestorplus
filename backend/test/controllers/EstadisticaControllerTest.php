<?php
declare(strict_types=1);

namespace Test\Controller;

use Controller\EstadisticaController;
use Model\Estadistica;
use Service\TokenService;
use Service\JsonResponseService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use Exception;
use ReflectionClass;

class EstadisticaControllerTest extends TestCase
{
    private EstadisticaController $controller;
    private MockObject $tokenServiceMock;
    private MockObject $jsonResponseServiceMock;
    private MockObject $estadisticaMock;

    protected function setUp(): void
    {
        // Crear mocks
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);
        $this->estadisticaMock = $this->createMock(Estadistica::class);

        // Crear mock parcial del controlador sin ejecutar constructor
        $this->controller = $this->getMockBuilder(EstadisticaController::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Inyectar mocks en propiedades privadas
        $ref = new ReflectionClass(EstadisticaController::class);

        // Propiedad estadistica
        $prop = $ref->getProperty('estadistica');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->estadisticaMock);

        // Propiedad tokenService
        $prop = $ref->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->tokenServiceMock);

        // Propiedad jsonResponseService en BaseController
        $baseRef = $ref->getParentClass();
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testObtenerTotalEstadisticasConPayloadInvalido(): void
    {
        // Simular payload inválido (null)
        $this->tokenServiceMock->expects($this->once())
            ->method('obtenerPayload')
            ->willReturn(null);

        // Esperar respuesta de error 401
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['error' => 'Token inválido o faltan datos'], 401);

        $this->controller->obtenerTotalEstadisticas();
    }

    public function testObtenerTotalEstadisticasConPayloadSinNumDoc(): void
    {
        // Simular payload sin propiedad data->num_doc
        $payload = (object)['data' => (object)[]];
        $this->tokenServiceMock->expects($this->once())
            ->method('obtenerPayload')
            ->willReturn($payload);

        // Esperar respuesta de error 401
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['error' => 'Token inválido o faltan datos'], 401);

        $this->controller->obtenerTotalEstadisticas();
    }

    public function testObtenerTotalEstadisticasRespondeCorrectamente(): void
    {
        // Simular payload válido con num_doc y rol
        $payload = (object)[
            'data' => (object)[
                'num_doc' => 123,
                'rol' => 'admin'
            ]
        ];
        $this->tokenServiceMock->expects($this->once())
            ->method('obtenerPayload')
            ->willReturn($payload);

        // Resultado esperado de estadistica
        $stats = [
            'totalJornadas' => 5,
            'totalGenerales' => 10,
            'totalActualizaciones' => 3
        ];
        $this->estadisticaMock->expects($this->once())
            ->method('obtenerTotalEstadisticas')
            ->with(123, 'admin')
            ->willReturn($stats);

        // Verificar respuesta con keys reetiquetadas
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with([
                'totalJornadas' => 5,
                'totalGenerales' => 10,
                'totalActualizaciones' => 3
            ]);

        $this->controller->obtenerTotalEstadisticas();
    }
}
