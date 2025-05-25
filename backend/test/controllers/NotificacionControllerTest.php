<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

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
        // Crear mocks de las dependencias
        $this->mockNotificacion        = $this->createMock(Notificacion::class);
        $this->mockTokenService        = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        // Controlador con métodos parciales
        $this->controller = $this->getMockBuilder(NotificacionController::class)
                                 ->onlyMethods(['parametrosRequeridos'])
                                 ->disableOriginalConstructor()
                                 ->getMock();

        // Inyectar las dependencias mediante reflexión
        $ref = new \ReflectionClass(NotificacionController::class);

        // Inyectar Notificacion
        $p = $ref->getProperty('notificacion');
        $p->setAccessible(true);
        $p->setValue($this->controller, $this->mockNotificacion);

        // Inyectar TokenService
        $p = $ref->getProperty('tokenService');
        $p->setAccessible(true);
        $p->setValue($this->controller, $this->mockTokenService);

        // Inyectar JsonResponseService en BaseController
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
            ->willReturn('123');  // Simulando que el token validado es '123'

        $notificaciones = [['id' => 1, 'msg' => 'Notificación 1']];  // Datos simulados
        $this->mockNotificacion
            ->expects($this->once())
            ->method('obtenerNotificaciones')
            ->with(123)  // El método debe recibir el número de documento 123
            ->willReturn($notificaciones);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['Notificaciones' => $notificaciones]);

        // Llamada al método que estamos probando
        $this->controller->obtenerNotificaciones();
    }

    public function testObtenerTodasLasNotificaciones(): void
    {
        $notificaciones = [['id' => 1, 'msg' => 'Todas las notificaciones']];  // Datos simulados
        $this->mockNotificacion
            ->expects($this->once())
            ->method('obtenerTodasLasNotificaciones')
            ->willReturn($notificaciones);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['Notificaciones' => $notificaciones]);

        // Llamada al método que estamos probando
        $this->controller->obtenerTodasLasNotificaciones();
    }

    public function testObtenerNotificacionesAspiranteSinToken(): void
    {
        $this->mockTokenService
            ->expects($this->once())
            ->method('validarToken')
            ->willReturn('');  // Simulamos que no se obtiene un token

        // No debe invocar el modelo ni responder con notificaciones
        $this->mockNotificacion
            ->expects($this->never())
            ->method('obtenerNotificacionesAspirante');
        $this->mockJsonResponseService
            ->expects($this->never())
            ->method('responderError');

        // Llamada al método que estamos probando
        $this->controller->obtenerNotificacionesAspirante();
    }

    public function testObtenerNotificacionesAspiranteNoHayNotificaciones(): void
    {
        $this->mockTokenService
            ->expects($this->once())
            ->method('validarToken')
            ->willReturn('456');  // Token simulado

        $this->mockNotificacion
            ->expects($this->once())
            ->method('obtenerNotificacionesAspirante')
            ->with(456)  // El método debe recibir el número de documento 456
            ->willReturn([]); 
            
        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responderError')
            ->with('No hay notificaciones', 404);  

        $this->controller->obtenerNotificacionesAspirante();
    }

    public function testObtenerNotificacionesAspiranteConNotificaciones(): void
    {
        $notificaciones = [['id' => 1, 'msg' => 'Notificación Aspirante']];  
        $this->mockTokenService
            ->expects($this->once())
            ->method('validarToken')
            ->willReturn('456');  

        $this->mockNotificacion
            ->expects($this->once())
            ->method('obtenerNotificacionesAspirante')
            ->with(456)  
            ->willReturn($notificaciones);

        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with(['message' => 'Notificaciones', 'data' => $notificaciones]);

        $this->controller->obtenerNotificacionesAspirante();
    }

}
