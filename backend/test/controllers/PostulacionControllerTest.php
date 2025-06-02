<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Controller\PostulacionController;
use Model\Postulacion;
use Service\TokenService;
use Service\JsonResponseService;

class PostulacionControllerTest extends TestCase
{
    private $controller;
    private $postulacionMock;
    private $tokenServiceMock;
    private $jsonResponseServiceMock;

    protected function setUp(): void
    {
        $this->postulacionMock = $this->createMock(Postulacion::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Crea el controlador SIN ejecutar el constructor real
        $this->controller = $this->getMockBuilder(PostulacionController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        // Inyecta los mocks usando Reflection
        $reflection = new \ReflectionClass($this->controller);

        $prop = $reflection->getProperty('postulacion');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->postulacionMock);

        $prop = $reflection->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->tokenServiceMock);

        // jsonResponseService está en la clase padre BaseController
        $baseRef = $reflection->getParentClass();
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testObtenerPostulaciones()
    {
        $expected = [['id' => 1, 'nombre' => 'Test']];
        $this->postulacionMock->expects($this->once())
            ->method('obtenerPostulaciones')
            ->willReturn($expected);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['Postulaciones' => $expected]);

        $this->controller->obtenerPostulaciones();
    }

    public function testVerificarPostulacionFaltaIdConvocatoria()
    {
        $_GET = []; // No se define idconvocatoria

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn('123456');

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with('Parámetro idconvocatoria requerido', 400);

        $this->controller->verificarPostulacion();
    }

    public function testObtenerPostulacionesAspiranteSinDatos()
    {
        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn('123456');

        $this->postulacionMock->expects($this->once())
            ->method('obtenerPostulacionesAspirante')
            ->willReturn([]);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with('No hay postulaciones', 404);

        $this->controller->obtenerPostulacionesAspirante();
    }

    public function testObtenerPostulacionesAgrupadasPorConvocatoriaSinId()
    {
        $_GET = [];
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with('Parámetro idconvocatoria requerido', 400);

        $this->controller->obtenerPostulacionesAgrupadasPorConvocatoria();
    }
}
