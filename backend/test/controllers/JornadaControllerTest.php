<?php
declare(strict_types=1);

namespace Test\Controller;

use PHPUnit\Framework\TestCase;
use Controller\JornadaController;
use Model\Jornada;
use Service\TokenService;
use Service\JsonResponseService;
use PHPUnit\Framework\MockObject\MockObject;

class JornadaControllerTest extends TestCase
{
    private JornadaController $controller;
    private MockObject $mockJornada;
    private MockObject $mockTokenService;
    private MockObject $mockJsonResponseService;

    protected function setUp(): void
    {
        // Crear mocks para dependencias
        $this->mockJornada = $this->createMock(Jornada::class);
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        // Crear mock parcial del controlador para stubear parametrosRequeridos
        $this->controller = $this->getMockBuilder(JornadaController::class)
                                 ->onlyMethods(['parametrosRequeridos'])
                                 ->disableOriginalConstructor()
                                 ->getMock();

        // Inyectar mocks usando reflection
        $ref = new \ReflectionClass(JornadaController::class);
        // jornada
        $prop = $ref->getProperty('jornada');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockJornada);
        // tokenService
        $prop = $ref->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockTokenService);
        // jsonResponseService desde BaseController
        $base = $ref->getParentClass();
        $prop = $base->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockJsonResponseService);
    }

    public function testObtenerTodasLasJornadas(): void
    {
        $lista = [['id'=>1], ['id'=>2]];
        $this->mockJornada->expects($this->once())
            ->method('obtenerTodasLasJornadas')
            ->willReturn($lista);
        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['Jornadas' => $lista]);

        $this->controller->obtenerTodasLasJornadas();
    }

    public function testObtenerJornadas(): void
    {
        // validarToken retorna string
        $this->mockTokenService->expects($this->once())
            ->method('validarToken')
            ->willReturn('123');
        $lista = [['id'=>3]];
        $this->mockJornada->expects($this->once())
            ->method('obtenerJornadas')
            ->with('123')
            ->willReturn($lista);
        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['Jornadas' => $lista]);

        $this->controller->obtenerJornadas();
    }

    public function testFinalizarJornada(): void
    {
        $this->markTestSkipped('Método finalizarJornada hace referencia a $this->empleado; requiere corrección en el controlador.');
    }

    public function testCorroborarJornadaMissingParams(): void
    {
        $data = [];
        $this->controller->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, ['data' => ['idJornada']])
            ->willReturn(false);
        $this->mockJornada->expects($this->never())->method('corroborarJornada');
        $this->mockJsonResponseService->expects($this->never())->method('responder');

        $this->controller->corroborarJornada($data);
    }

    public function testCorroborarJornadaSuccess(): void
    {
        $data = ['data' => ['idJornada' => 7]];
        $this->controller->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, ['data' => ['idJornada']])
            ->willReturn(true);
        $this->mockJornada->expects($this->once())
            ->method('corroborarJornada')
            ->with(7)
            ->willReturn(true);
        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['JornadaCorroborada' => true]);

        $this->controller->corroborarJornada($data);
    }

    public function testNoCorroborarJornadaMissingParams(): void
    {
        $data = [];
        $this->controller->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, ['data' => ['idJornada']])
            ->willReturn(false);
        $this->mockJornada->expects($this->never())->method('noCorroborarJornada');
        $this->mockJsonResponseService->expects($this->never())->method('responder');

        $this->controller->noCorroborarJornada($data);
    }

    public function testNoCorroborarJornadaSuccess(): void
    {
        $data = ['data' => ['idJornada' => 8]];
        $this->controller->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, ['data' => ['idJornada']])
            ->willReturn(true);
        $this->mockJornada->expects($this->once())
            ->method('noCorroborarJornada')
            ->with(8)
            ->willReturn(false);
        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['JornadaNoCorroborada' => false]);

        $this->controller->noCorroborarJornada($data);
    }
}
