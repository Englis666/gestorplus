<?php
declare(strict_types=1);

namespace Test\Controller;

use PHPUnit\Framework\TestCase;
use Controller\NotificacionController;
use Model\Notificacion;
use Service\TokenService;
use Service\JsonResponseService;
use PHPUnit\Framework\MockObject\MockObject;

class NotificacionControllerTest extends TestCase
{
    private NotificacionController $controller;
    private MockObject $mockNotificacion;
    private MockObject $mockTokenService;
    private MockObject $mockJsonResponseService;

    protected function setUp(): void
    {
        // Crear mocks
        $this->mockNotificacion        = $this->createMock(Notificacion::class);
        $this->mockTokenService        = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        // Controlador parcial
        $this->controller = $this->getMockBuilder(NotificacionController::class)
                                 ->onlyMethods(['parametrosRequeridos'])
                                 ->disableOriginalConstructor()
                                 ->getMock();

        // Inyectar con reflection
        $ref = new \ReflectionClass(NotificacionController::class);

        // notificacion
        $p = $ref->getProperty('notificacion');
        $p->setAccessible(true);
        $p->setValue($this->controller, $this->mockNotificacion);

        // tokenService
        $p = $ref->getProperty('tokenService');
        $p->setAccessible(true);
        $p->setValue($this->controller, $this->mockTokenService);

        // jsonResponseService en BaseController
        $base = $ref->getParentClass();
        $p    = $base->getProperty('jsonResponseService');
        $p->setAccessible(true);
        $p->setValue($this->controller, $this->mockJsonResponseService);
    }

    public function testObtenerNotificaciones(): void
    {
        $this->mockTokenService
            ->expects($this->once())
            ->method('validarToken')
            ->willReturn('abc');

        $lista = [['id' => 1, 'msg' => 'Hola']];
        $this->mockNotificacion
            ->expects($this->once())
            ->method('obtenerNotificaciones')
            ->with('abc')
            ->willReturn($lista);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['Notificaciones' => $lista]);

        $this->controller->obtenerNotificaciones();
    }

    public function testObtenerTodasLasNotificaciones(): void
    {
        $lista = [['id' => 1, 'msg' => 'Todos']];
        $this->mockNotificacion
            ->expects($this->once())
            ->method('obtenerTodasLasNotificaciones')
            ->willReturn($lista);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['Notificaciones' => $lista]);

        $this->controller->obtenerTodasLasNotificaciones();
    }

    public function testObtenerNotificacionesAspiranteNoToken(): void
    {
        $this->mockTokenService
            ->expects($this->once())
            ->method('validarToken')
            ->willReturn('');

        // No debe invocar al modelo ni al responderError
        $this->mockNotificacion
            ->expects($this->never())
            ->method('obtenerNotificacionesAspirante');
        $this->mockJsonResponseService
            ->expects($this->never())
            ->method('responderError');

        $this->controller->obtenerNotificacionesAspirante();
    }

    public function testObtenerNotificacionesAspiranteNotFound(): void
    {
        $this->mockTokenService
            ->expects($this->once())
            ->method('validarToken')
            ->willReturn('xyz');

        $this->mockNotificacion
            ->expects($this->once())
            ->method('obtenerNotificacionesAspirante')
            ->with('xyz')
            ->willReturn([]);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responderError')
            ->with('No hay notificaciones', 404);

        $this->controller->obtenerNotificacionesAspirante();
    }

    public function testObtenerNotificacionesAspiranteSuccess(): void
    {
        $data = [['id' => 2, 'msg' => 'Mensaje']];
        $this->mockTokenService
            ->expects($this->once())
            ->method('validarToken')
            ->willReturn('xyz');

        $this->mockNotificacion
            ->expects($this->once())
            ->method('obtenerNotificacionesAspirante')
            ->with('xyz')
            ->willReturn($data);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['message' => 'Notificaciones', 'data' => $data]);

        $this->controller->obtenerNotificacionesAspirante();
    }
}
