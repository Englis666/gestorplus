<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Controller;

use Controller\AspiranteController;
use Model\Aspirante;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use Service\JsonResponseService;
use Service\TokenService;

class AspiranteControllerTest extends TestCase
{
    private MockObject $controller;
    private MockObject $aspiranteMock;
    private MockObject $tokenServiceMock;
    private MockObject $jsonResponseServiceMock;

    protected function setUp(): void
    {
        $this->aspiranteMock = $this->createMock(Aspirante::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        $this->controller = $this->getMockBuilder(AspiranteController::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['parametrosRequeridos', 'getIntParam'])
            ->getMock();

        $ref = new \ReflectionClass(AspiranteController::class);

        $prop = $ref->getProperty('aspirante');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->aspiranteMock);

        $prop = $ref->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->tokenServiceMock);

        $baseRef = $ref->getParentClass(); // BaseController
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testAplicacionDeAspiranteConParametrosValidos(): void
    {
        $data = ['idconvocatoria' => 10];
        $num_doc = '12345';

        $this->tokenServiceMock->method('validarToken')->willReturn($num_doc);
        $this->controller->method('parametrosRequeridos')->willReturn(true);
        $this->controller->method('getIntParam')->willReturn(10);

        $this->aspiranteMock->expects($this->once())
            ->method('aplicacionDeAspirante')
            ->with($num_doc, 10)
            ->willReturn(true);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['message' => 'success', 'data' => true]);

        $this->controller->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteFalla(): void
    {
        $data = ['idconvocatoria' => 10];
        $num_doc = '12345';

        $this->tokenServiceMock->method('validarToken')->willReturn($num_doc);
        $this->controller->method('parametrosRequeridos')->willReturn(true);
        $this->controller->method('getIntParam')->willReturn(10);

        $this->aspiranteMock->expects($this->once())
            ->method('aplicacionDeAspirante')
            ->willReturn(false);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with('No se pudo completar la aplicación', 500);

        $this->controller->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteParametrosFaltantes(): void
    {
        $data = [];

        $this->tokenServiceMock->method('validarToken')->willReturn('12345');

        $this->controller->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, ['idconvocatoria'])
            ->willReturn(false);

        $this->aspiranteMock->expects($this->never())
            ->method('aplicacionDeAspirante');

        $this->jsonResponseServiceMock->expects($this->never())
            ->method('responder');

        $this->controller->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteTokenInvalido(): void
    {
        $data = ['idconvocatoria' => 10];
        $this->tokenServiceMock->method('validarToken')->willReturn(null);

        $this->aspiranteMock->expects($this->never())
            ->method('aplicacionDeAspirante');
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with('Token Invalido', 401);

        $this->controller->aplicacionDeAspirante($data);
    }
}
