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
    private AspiranteController $controller;
    private MockObject $mockAspirante;
    private MockObject $mockTokenService;
    private MockObject $mockJsonResponseService;

    protected function setUp(): void
    {
        $this->mockAspirante = $this->createMock(Aspirante::class);
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        $this->controller = $this->getMockBuilder(AspiranteController::class)
            ->onlyMethods(['parametrosRequeridos', 'getIntParam'])
            ->disableOriginalConstructor()
            ->getMock();

        $ref = new \ReflectionClass(AspiranteController::class);

        // Inyectar propiedades privadas
        $prop = $ref->getProperty('aspirante');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockAspirante);

        $prop = $ref->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockTokenService);

        $baseRef = $ref->getParentClass(); // BaseController
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockJsonResponseService);
    }

    public function testAplicacionDeAspiranteConParametrosValidos(): void
    {
        $data = ['idconvocatoria' => 10];
        $num_doc = '12345';

        $this->mockTokenService->method('validarToken')->willReturn($num_doc);
        $this->controller->method('parametrosRequeridos')->willReturn(true);
        $this->controller->method('getIntParam')->willReturn(10);

        $this->mockAspirante->expects($this->once())
            ->method('aplicacionDeAspirante')
            ->with($num_doc, 10)
            ->willReturn(true);

        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['message' => 'success', 'data' => true]);

        $this->controller->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteFalla(): void
    {
        $data = ['idconvocatoria' => 10];
        $num_doc = '12345';

        $this->mockTokenService->method('validarToken')->willReturn($num_doc);
        $this->controller->method('parametrosRequeridos')->willReturn(true);
        $this->controller->method('getIntParam')->willReturn(10);

        $this->mockAspirante->expects($this->once())
            ->method('aplicacionDeAspirante')
            ->willReturn(false);

        $this->mockJsonResponseService->expects($this->once())
            ->method('responderError')
            ->with('No se pudo completar la aplicación', 500);

        $this->controller->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteParametrosFaltantes(): void
    {
        $data = [];

        $this->mockTokenService->method('validarToken')->willReturn('12345');

        $this->controller->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, ['idconvocatoria'])
            ->willReturn(false);

        $this->mockAspirante->expects($this->never())
            ->method('aplicacionDeAspirante');

        $this->mockJsonResponseService->expects($this->never())
            ->method('responder');

        $this->controller->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteTokenInvalido(): void
    {
        $data = ['idconvocatoria' => 10];
            $this->mockTokenService->method('validarToken')
            ->willReturn('token_invalido');
            $this->mockAspirante->expects($this->never())
            ->method('aplicacionDeAspirante');
            $this->controller->aplicacionDeAspirante($data);
    }
    
}
